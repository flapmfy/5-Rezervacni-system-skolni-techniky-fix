<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sharedProps = array_merge(parent::share($request), [
            'flash' => $request->session()->get('flash'),
        ]);

        if (! Auth::check()) {
            return $sharedProps;
        }

        $user = Auth::user();

        $waitingReservationsCount = null;
        $acceptedReservationsCount = null;
        $activeReservationsCount = null;
        $archivedReservationsCount = null;

        if ($user->is_admin) {
            $waitingReservationsCount = $user->reservationsToManage->where('status', 'neschváleno')->count();
            $acceptedReservationsCount = $user->reservationsToManage->where('status', 'schváleno')->count();
            $activeReservationsCount = $user->reservationsToManage->where('status', 'probíhá')->count();
            $archivedReservationsCount = $user->reservationsToManage->where('status', 'archivováno')->count();
        }

        if (! $user->is_admin) {
            $waitingReservationsCount = $user->reservations->where('status', 'neschváleno')->count();
            $acceptedReservationsCount = $user->reservations->where('status', 'schváleno')->count();
            $activeReservationsCount = $user->reservations->where('status', 'probíhá')->count();
            $archivedReservationsCount = $user->reservations->where('status', 'archivováno')->count();
        }

        return array_merge($sharedProps, [
            'auth' => [
                'user' => [
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'class' => $user->class,
                    'isAdmin' => $user->is_admin,
                ],
            ],
            'waitingReservationsCount' => $waitingReservationsCount,
            'acceptedReservationsCount' => $acceptedReservationsCount,
            'activeReservationsCount' => $activeReservationsCount,
            'archivedReservationsCount' => $archivedReservationsCount,
        ]);
    }
}
