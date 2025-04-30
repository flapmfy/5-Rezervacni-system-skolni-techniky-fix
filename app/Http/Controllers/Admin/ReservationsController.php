<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use App\Notifications\ReservationApproved;
use App\Notifications\ReservationDisapproved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReservationsController extends Controller
{
    private function getReservationsList(string $status, Request $request)
    {
        $filters = $request->only(['vyhledavani']);
        $query = Auth::user()->reservationsToManage()
            ->where('status', $status)
            ->with(['equipment' => function ($query) {
                $query->withTrashed();
            }])
            ->select([
                'reservations.id',
                'reservations.equipment_id',
                'reservations.user_id',
                'reservations.start_date',
                'reservations.end_date',
                'reservations.status',
                'reservations.equipment_condition_start',
                'reservations.equipment_condition_end',
                'reservations.pickup_date',
                'reservations.return_date',
            ]);

        if (! empty($filters['vyhledavani'])) {
            $query->where(function ($query) use ($filters) {
                $query->whereHas('equipment', function ($q) use ($filters) {
                    $q->withTrashed()->where('name', 'like', '%'.$filters['vyhledavani'].'%');
                })
                    ->orWhereHas('user', function ($q) use ($filters) {
                        $q->where('name', 'like', '%'.$filters['vyhledavani'].'%');
                    });
            });
        }

        return $query
            ->orderBy('start_date', 'asc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($reservation) {
                $user = User::find($reservation->user_id);

                return [
                    'id' => $reservation->id,
                    'equipment' => [
                        'id' => $reservation->equipment_id,
                        'slug' => $reservation->equipment->slug,
                        'name' => optional($reservation->equipment)->name,
                        'trashed' => optional($reservation->equipment)->trashed() ?? false,
                    ],
                    'student' => [
                        'name' => $user ? $user->first_name . ' ' . $user->last_name : 'neexistuje',
                        'class' => $user ? $user->class : '',
                    ],
                    'start_date' => $reservation->start_date,
                    'end_date' => $reservation->end_date,
                    'equipment_condition_start' => $reservation->equipment_condition_start,
                    'equipment_condition_end' => $reservation->equipment_condition_end,
                    'pickup_date' => $reservation->pickup_date,
                    'return_date' => $reservation->return_date,
                ];
            });
    }

    // Zobrazení neschválených rezervací
    public function waiting(Request $request)
    {
        $waitingReservations = $this->getReservationsList('neschváleno', $request);

        return Inertia::render('Admin/Reservations/Waiting/Index', [
            'waitingReservations' => $waitingReservations,
            'filters' => $request->only(['vyhledavani']),
        ]);
    }

    public function accepted(Request $request)
    {
        $acceptedReservations = $this->getReservationsList('schváleno', $request);

        return Inertia::render('Admin/Reservations/Accepted/Index', [
            'acceptedReservations' => $acceptedReservations,
            'filters' => $request->only(['vyhledavani']),
        ]);
    }

    public function active(Request $request)
    {
        $activeReservations = $this->getReservationsList('probíhá', $request);

        return Inertia::render('Admin/Reservations/Active/Index', [
            'activeReservations' => $activeReservations,
            'filters' => $request->only(['vyhledavani']),
        ]);
    }

    // Zobrazení archivovaných rezervací
    public function archived(Request $request)
    {
        $archivedReservations = $this->getReservationsList('archivováno', $request)->through(function ($reservation) {
            return [...$reservation, 'issues' => checkReservationIssues($reservation)];
        });

        return Inertia::render('Admin/Reservations/Archived/Index', [
            'archivedReservations' => $archivedReservations,
            'filters' => $request->only(['vyhledavani']),
        ]);
    }

    public function showWaiting($id)
    {
        $reservation = Reservation::with('equipment.category')
            ->select([
                'id',
                'user_id',
                'equipment_id',
                'start_date',
                'end_date',
                'created_at',
                'user_comment',
            ])
            ->where('id', $id)
            ->where('status', 'neschváleno')
            ->firstOrFail();

        Gate::authorize('view', $reservation);

        $reservationUser = $reservation->user;

        if ($reservation->equipment) {
            $reservation->equipment->image_path = $reservation->equipment->image_path
                ? Storage::url($reservation->equipment->image_path)
                : null;
        }

        $pastReservations = $reservationUser->reservations()
            ->select([
                'id',
                'start_date',
                'end_date',
                'equipment_condition_start',
                'equipment_condition_end',
                'pickup_date',
                'return_date',
                'comment',
                'equipment_id',
            ])
            ->where('status', 'archivováno')
            ->with(['equipment' => function ($query) {
                $query->select('id', 'name', 'user_id')
                    ->with(['owner' => function ($q) {
                        $q->select('id', 'first_name', 'last_name');
                    }]);
            }])
            ->get()->map(function ($reservation) {
                return [
                    ...$reservation->toArray(),
                    'issues' => checkReservationIssues($reservation),
                ];
            });

        $adminId = Auth::user()->id;

        $adminManagedPast = $pastReservations->filter(function ($reservation) use ($adminId) {
            return $reservation['equipment'] && $reservation['equipment']['user_id'] == $adminId;
        })->values();

        $nonAdminManagedPast = $pastReservations->filter(function ($reservation) use ($adminId) {
            return ! $reservation['equipment'] || $reservation['equipment']['user_id'] != $adminId;
        })->values();

        return Inertia::render('Admin/Reservations/Waiting/Show', [
            'reservation' => $reservation,
            'student' => [
                'name' => $reservationUser ? $reservationUser->first_name . ' ' . $reservationUser->last_name : 'Uživatel neexistuje',
                'class' => $reservationUser ? $reservationUser->class : '',
                'email' => $reservationUser ? $reservationUser->email : '',
                'past_reservations_managed' => $adminManagedPast,
                'past_reservations_other' => $nonAdminManagedPast,
            ],
        ]);
    }

    public function showAccepted($id)
    {
        $reservation = Reservation::with(['equipment' => function ($query) {
            $query->withTrashed()->with('category');
        }])
            ->select([
                'id',
                'user_id',
                'equipment_id',
                'start_date',
                'end_date',
                'created_at',
                'comment',
                'user_comment',
            ])
            ->where('id', $id)
            ->where('status', 'schváleno')
            ->firstOrFail();

        Gate::authorize('view', $reservation);

        $reservationUser = $reservation->user;

        // Process the equipment's image path and category details directly in the data.
        if ($reservation->equipment) {
            $reservation->equipment->image_path = $reservation->equipment->image_path
                ? Storage::url($reservation->equipment->image_path)
                : null;

        }

        return Inertia::render('Admin/Reservations/Accepted/Show', [
            'reservation' => $reservation,
            'student' => [
                'name' => $reservationUser ? $reservationUser->first_name . ' ' . $reservationUser->last_name : 'Uživatel neexistuje',
                'class' => $reservationUser ? $reservationUser->class : '',
                'email' => $reservationUser ? $reservationUser->email : '',
            ],
        ]);
    }

    public function showActive($id)
    {
        $reservation = Reservation::with(['equipment' => function ($query) {
            $query->withTrashed()->with('category');
        }])
            ->select([
                'id',
                'user_id',
                'equipment_id',
                'start_date',
                'end_date',
                'created_at',
                'comment',
                'equipment_condition_start',
                'pickup_date',
            ])
            ->where('id', $id)
            ->where('status', 'probíhá')
            ->firstOrFail();

        Gate::authorize('view', $reservation);

        $reservationUser = $reservation->user;

        // Process the equipment's image path and category details directly in the data.
        if ($reservation->equipment) {
            $reservation->equipment->image_path = $reservation->equipment->image_path
                ? Storage::url($reservation->equipment->image_path)
                : null;

        }

        return Inertia::render('Admin/Reservations/Active/Show', [
            'reservation' => $reservation,
            'student' => [
                'name' => $reservationUser ? $reservationUser->first_name . ' ' . $reservationUser->last_name : 'Uživatel neexistuje',
                'class' => $reservationUser ? $reservationUser->class : '',
                'email' => $reservationUser ? $reservationUser->email : '',
            ],
        ]);
    }

    public function showArchived($id)
    {
        $reservation = Reservation::with('equipment.category')
            ->select([
                'id',
                'user_id',
                'equipment_id',
                'start_date',
                'end_date',
                'created_at',
                'comment',
                'user_comment',
                'equipment_condition_start',
                'equipment_condition_end',
                'pickup_date',
                'return_date',
            ])
            ->where('id', $id)
            ->where('status', 'archivováno')
            ->firstOrFail();

        Gate::authorize('view', $reservation);

        $reservationUser = $reservation->user;

        if ($reservation->equipment) {
            $reservation->equipment->image_path = $reservation->equipment->image_path
                ? Storage::url($reservation->equipment->image_path)
                : null;
        }

        return Inertia::render('Admin/Reservations/Archived/Show', [
            'reservation' => $reservation,
            'reservation_issues' => checkReservationIssues($reservation),
            'student' => [
                'name' => $reservationUser ? $reservationUser->first_name . ' ' . $reservationUser->last_name : 'Uživatel neexistuje',
                'class' => $reservationUser ? $reservationUser->class : '',
                'email' => $reservationUser ? $reservationUser->email : '',
            ],
        ]);
    }

    public function acceptWaiting(Request $request)
    {
        $reservation = Reservation::where('id', $request->id)
            ->where('status', 'neschváleno')
            ->firstOrFail();

        Gate::authorize('update', $reservation);

        $reservation->update([
            'status' => 'schváleno',
            'comment' => $request->message,
        ]);

        Notification::route('mail', $reservation->user->email)->notify(new ReservationApproved($reservation));

        return to_route('admin.reservations.waiting')
            ->with('flash', flash('success', 'Žádost úspěšně schválena!'));
    }

    public function acceptAccepted(Request $request)
    {
        $reservation = Reservation::where('id', $request->id)
            ->where('status', 'schváleno')
            ->firstOrFail();

        Gate::authorize('update', $reservation);

        $reservation->update([
            'status' => 'probíhá',
            'comment' => $request->message,
            'equipment_condition_start' => $request->equipmentCondition,
            'pickup_date' => now(),
        ]);

        return to_route('admin.reservations.accepted')
            ->with('flash', flash('success', 'Žádost úspěšně schválena!'));
    }

    public function declineWaiting(Request $request)
    {
        $declineMessage = $request->message;
        
        $reservation = Reservation::where('id', $request->id)
            ->where('status', 'neschváleno')
            ->firstOrFail();

        Gate::authorize('delete', $reservation);

        Notification::route('mail', $reservation->user->email)->notify(new ReservationDisapproved($reservation, $declineMessage));

        $reservation->delete();

        return to_route('admin.reservations.waiting')
            ->with('flash', flash('success', 'Žádost odmítnuta!'));
    }

    public function declineAccepted(Request $request)
    {
        $declineMessage = $request->message;

        $reservation = Reservation::where('id', $request->id)
            ->where('status', 'schváleno')
            ->firstOrFail();

        Gate::authorize('delete', $reservation);

        Notification::route('mail', $reservation->user->email)->notify(new ReservationDisapproved($reservation, $declineMessage));

        if ($reservation->start_date < now()) {
            $reservation->update([
                'status' => 'archivováno',
            ]);
        } else {
            $reservation->delete();
        }

        return to_route('admin.reservations.accepted')
            ->with('flash', flash('success', 'Žádost odmítnuta!'));
    }

    public function endActive(Request $request)
    {
        $reservation = Reservation::where('id', $request->id)
            ->where('status', 'probíhá')
            ->firstOrFail();

        Gate::authorize('update', $reservation);

        $reservation->update([
            'status' => 'archivováno',
            'comment' => $request->message,
            'equipment_condition_end' => $request->equipmentCondition,
            'return_date' => now(),
        ]);

        return to_route('admin.reservations.active')
            ->with('flash', flash('success', 'Rezervace byla ukončena!'));
    }

    public function calendar()
    {
        $reservations = Auth::user()->reservationsToManage()
            ->where('status', '!=', 'archivováno')
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'start_date' => $reservation->start_date,
                    'end_date' => $reservation->end_date,
                    'status' => $reservation->status,
                    'equipment_name' => $reservation->equipment->name,
                    'user_name' => $reservation->user->first_name . ' ' . $reservation->user->last_name,
                    'user_class' => $reservation->user->class,
                ];
            });

        return Inertia::render('Admin/Calendar', [
            'reservations' => $reservations,
        ]);
    }
}
