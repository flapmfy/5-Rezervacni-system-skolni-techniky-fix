<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\Reservation;
use App\Notifications\ReservationCancelledAlert;
use App\Notifications\ReservationReceived;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReservationsController extends Controller
{
    public function active()
    {
        $activeReservations = Auth::user()->reservations()->with(['equipment' => function ($query) {
            $query->withTrashed(); // i rezervace vázané na vymazané vybavení
        }])
            ->where('status', 'probíhá')
            ->orderBy('start_date')
            ->get()
            ->map(function ($reservation) {
                $equipment = $reservation->equipment;

                return [
                    'id' => $reservation->id,
                    'equipment' => $equipment ? [
                        'id' => $equipment->id,
                        'name' => $equipment->name,
                        'image' => $equipment->image_path ? Storage::url($equipment->image_path) : null,
                        'room' => $equipment->room,
                        'slug' => $equipment->slug,
                        'admin' => $equipment->owner->first_name . ' ' . $equipment->owner->last_name,
                        'trashed' => $equipment->trashed(),
                    ] : null,
                    'start_date' => $reservation->start_date,
                    'end_date' => $reservation->end_date,
                    'comment' => $reservation->comment,
                    'status' => $reservation->status,
                    'condition' => $reservation->equipment_condition_start,
                ];
            });

        return Inertia::render('Student/Reservations/Active', [
            'activeReservations' => $activeReservations,
        ]);
    }

    // Zobrazení schválených rezervací
    public function accepted()
    {
        $acceptedReservations = Auth::user()->reservations()->with(['equipment' => function ($query) {
            $query->withTrashed();
        }])
            ->where('status', 'schváleno')
            ->orderBy('start_date')
            ->get()
            ->map(function ($reservation) {
                $equipment = $reservation->equipment;

                return [
                    'id' => $reservation->id,
                    'equipment' => $equipment ? [
                        'id' => $equipment->id,
                        'name' => $equipment->name,
                        'room' => $equipment->room,
                        'slug' => $equipment->slug,
                        'admin' => $equipment->owner->first_name . ' ' . $equipment->owner->last_name,
                        'trashed' => $equipment->trashed(),
                    'image_path' => $reservation->equipment->image_path ? Storage::url($reservation->equipment->image_path) : null,

                    ] : null,
                    'start_date' => $reservation->start_date,
                    'end_date' => $reservation->end_date,
                    'comment' => $reservation->comment,
                    'status' => $reservation->status,
                ];
            });

        return Inertia::render('Student/Reservations/Accepted', [
            'acceptedReservations' => $acceptedReservations,
        ]);
    }

    // Zobrazení neschválených rezervací
    public function waiting()
    {
        $waitingReservations = Auth::user()->reservations()->where('status', 'neschváleno')->get()->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'equipment' => [
                    'id' => $reservation->equipment->id,
                    'name' => $reservation->equipment->name,
                    'admin' => $reservation->equipment->owner->first_name . ' ' . $reservation->equipment->owner->last_name,
                    'slug' => $reservation->equipment->slug,
                    'room' => $reservation->equipment->room,
                    'image_path' => $reservation->equipment->image_path ? Storage::url($reservation->equipment->image_path) : null,
                ],
                'start_date' => $reservation->start_date,
                'end_date' => $reservation->end_date,
            ];
        })->sortBy('start_date')->values()->all();

        return Inertia::render('Student/Reservations/Waiting', [
            'waitingReservations' => $waitingReservations,
        ]);
    }

    // Zobrazení archivovaných rezervací
    public function archived()
    {
        $archivedReservations = Auth::user()->reservations()->with(['equipment' => function ($query) {
            $query->withTrashed();
        }])
            ->where('status', 'archivováno')
            ->orderBy('start_date')
            ->get()
            ->map(function ($reservation) {
                $equipment = $reservation->equipment;

                return [
                    'id' => $reservation->id,
                    'equipment' => $equipment ? [
                        'id' => $equipment->id,
                        'name' => $equipment->name,
                        'room' => $equipment->room,
                        'trashed' => $equipment->trashed(),
                        'slug' => $equipment->slug,
                        'image' => $equipment->image_path ? Storage::url($equipment->image_path) : null,
                    ] : null,
                    'teacher' => $reservation->admin->first_name . ' ' . $reservation->admin->last_name,
                    'comment' => $reservation->comment,
                    'start_date' => $reservation->start_date,
                    'end_date' => $reservation->end_date,
                    'return_date' => $reservation->return_date,
                    'pickup_date' => $reservation->pickup_date,
                    'equipment_condition_end' => $reservation->equipment_condition_end,
                    'equipment_condition_start' => $reservation->equipment_condition_start,
                    'issues' => checkReservationIssues($reservation),
                ];
            });

        return Inertia::render('Student/Reservations/Archived', [
            'archivedReservations' => $archivedReservations,
        ]);
    }

    // Vytvoření rezervace
    public function store(Request $request)
    {
        $request->validate([
            'equipmentId' => 'required|exists:equipment,id',
            'startDate' => 'required|date|after:today',
            'endDate' => 'required|date|after_or_equal:startDate',
            'comment' => 'required|string|max:255',
        ], [
            'equipmentId.required' => 'Vybavení musí být vybráno.',
            'equipmentId.exists' => 'Vybrané vybavení neexistuje.',
            'startDate.required' => 'Počáteční datum musí být vyplněno.',
            'startDate.date' => 'Počáteční datum není ve správném formátu.',
            'startDate.after' => 'Počáteční datum musí být později než dnes.',
            'endDate.required' => 'Koncové datum musí být vyplněno.',
            'endDate.date' => 'Koncové datum není ve správném formátu.',
            'endDate.after_or_equal' => 'Koncové datum musí být stejné nebo později než počáteční datum.',
            'comment.required' => 'Komentář musí být vyplněn.',
            'comment.string' => 'Komentář není ve správném formátu.',
            'comment.max' => 'Komentář nemůže být delsí než 255 znaků.',
        ]);

        // kontrola zda začíná o víkendu
        $startDate = Carbon::parse($request->startDate);
        $endDate = Carbon::parse($request->endDate);

        if ($this->containsWeekend($startDate, $endDate)) {
            return back()->with('flash', flash(
                'error',
                'Rezervace nemůže začínat ani končit o víkendu. Vyberte pracovní dny (pondělí až pátek).'
            ));
        }

        $isFullyBooked = $this->isFullyBooked(
            $request->equipmentId,
            $startDate,
            $endDate
        );

        if ($isFullyBooked) {
            return back()->with('flash', flash(
                'error',
                'Vybavení není v tomto termínu k dispozici. Všechny kusy jsou již rezervovány.'
            ));
        }

        // vytvoření transakce - zabránění 1 vybavení 2 uživateli ve stejný moment
        try {
            DB::beginTransaction();

            if ($isFullyBooked) {
                DB::rollBack();

                return back()->with('flash', flash(
                    'error',
                    'Vybavení bylo právě rezervováno jiným uživatelem.'
                ));
            }

            // Create the reservation
            $reservation = Reservation::create([
                'user_id' => Auth::user()->id,
                'equipment_id' => $request->equipmentId,
                'start_date' => $request->startDate,
                'end_date' => $request->endDate,
                'status' => 'neschváleno',
                'user_comment' => $request->comment,
                'name' => $request->name,
                'room' => $request->room,
            ]);

            // Send email
            Notification::route('mail', Auth::user()->email)->notify(new ReservationReceived($reservation));

            DB::commit();

            return to_route('equipment.index')->with('flash', flash(
                'success',
                'Rezervace byla úspěšně vytvořena'
            ));

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('flash', flash(
                'error',
                'Při vytváření rezervace došlo k chybě. Zkuste to prosím znovu.'
            ));
        }
    }

    private function containsWeekend(Carbon $startDate, Carbon $endDate): bool
    {
        return $startDate->isWeekend() || $endDate->isWeekend();
    }

    private function isFullyBooked($equipmentId, Carbon $startDate, Carbon $endDate): int
    {
        // získání rezervací nacházejících se v rozsahu datumů
        $reservations = Reservation::where('equipment_id', $equipmentId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->where('status', '!=', 'archivováno')
            ->get();

        $dates = [];
        foreach ($reservations as $reservation) {
            $currentStart = Carbon::parse($reservation->start_date);
            $currentEnd = Carbon::parse($reservation->end_date);

            while ($currentStart->lte($currentEnd)) {
                $dates[$currentStart->toDateString()] = ($dates[$currentStart->toDateString()] ?? 0) + 1;
                $currentStart->addDay();
            }
        }

        // kontrola, zda je termín obsazen
        $equipment = Equipment::findOrFail($equipmentId);
        foreach ($dates as $date => $count) {
            if ($count >= $equipment->quantity) {
                return true;
            }
        }

        return false;
    }

    // Odstranění rezervace
    public function delete($id)
    {
        $reservation = Reservation::find($id);
        Gate::authorize('userDelete', $reservation);

        if ($reservation->status === 'probíhá') {
            back()->with('flash', flash(
                'error',
                'Nelze odstranit rezervaci, která probíhá.'));
        }

        if ($reservation->status === 'schváleno' && $reservation->start_date < now()) {
          $reservation->update([
                'status' => 'archivováno',
            ]);
            return back()->with('flash', flash(
                'warning',
                'Rezervace byla zrušena a zaznamenána jako nevyzvednutá.'));
        }

        $this->reservation = $reservation;
        $equipment = $this->reservation->equipment;
        Notification::route('mail', $equipment->owner->email)->notify(new ReservationCancelledAlert($reservation));

        $reservation->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Rezervace byla úspěšně odstraněna.',
            'timestamp' => now()->timestamp,
        ]);
    }
}
