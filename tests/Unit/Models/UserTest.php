<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Equipment;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function needs_profile_completion_returns_true_when_first_or_last_name_are_missing()
    {
        $user = User::factory()->create([
            'first_name' => null,
            'last_name'  => null,
        ]);

        $this->assertTrue($user->needsProfileCompletion());
    }

    /** @test */
    public function needs_profile_completion_returns_false_when_first_and_last_name_are_set()
    {
        $user = User::factory()->create([
            'first_name' => 'John',
            'last_name'  => 'Doe',
        ]);

        $this->assertFalse($user->needsProfileCompletion());
    }

    /** @test */
    public function reservations_to_manage_returns_reservations_from_users_equipment()
    {
        $user = User::factory()->create([
            'first_name' => 'John',
            'last_name'  => 'Doe',
        ]);

        // Vytvoříme vybavení vlastněné tímto uživatelem.
        $equipment = \App\Models\Equipment::factory()->create([
            'user_id' => $user->id,
        ]);

        // Vytvoříme rezervaci pro toto vybavení.
        $reservation = \App\Models\Reservation::factory()->create([
            'equipment_id' => $equipment->id,
        ]);

        $this->assertCount(1, $user->reservationsToManage);
        $this->assertEquals($reservation->id, $user->reservationsToManage->first()->id);
    }
    
    /** @test */
    public function user_can_have_multiple_equipment()
    {
        $user = User::factory()->create();

        Equipment::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $this->assertCount(3, $user->equipment);
    }
}
