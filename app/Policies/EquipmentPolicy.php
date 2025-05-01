<?php

namespace App\Policies;

use App\Models\Equipment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EquipmentPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Equipment $equipment)
    {
        return $user->id === $equipment->user_id ? Response::allow() : Response::deny('Nemáte práva ke změně tohoto vybavení.');
    }

    public function view(User $user, Equipment $equipment)
    {
        return $user->id === $equipment->user_id ? Response::allow() : Response::denyAsNotFound();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Equipment $equipment)
    {
        return $user->id === $equipment->user_id ? Response::allow() : Response::deny('Nemáte práva k odstranění tohoto vybavení.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Equipment $equipment)
    {
        return $user->id === $equipment->user_id ? Response::allow() : Response::deny('Nemáte práva k obnovení.');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Equipment $equipment)
    {
        return $user->id === $equipment->user_id ? Response::allow() : Response::deny('Nemáte práva k trvalému odstranění.');
    }
}
