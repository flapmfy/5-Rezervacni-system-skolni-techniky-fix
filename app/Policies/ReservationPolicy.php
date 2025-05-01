<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ReservationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->equipment->owner->id ? Response::allow() : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->equipment->owner->id ? Response::allow() : Response::deny('K této akci nemáte oprávnění.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->equipment->owner->id ? Response::allow() : Response::deny('Tuto rezervaci nemůžete odstranit.');
    }

    public function userDelete(User $user, Reservation $reservation)
    {
        return $user->id === $reservation->user_id ? Response::allow() : Response::deny('Tuto rezervaci nemůžete odstranit.');
    }
}
