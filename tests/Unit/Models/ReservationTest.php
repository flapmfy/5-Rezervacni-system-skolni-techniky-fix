<?php

namespace Tests\Unit\Models;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_reservation_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $reservation = Reservation::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->assertInstanceOf(User::class, $reservation->user);
        $this->assertEquals($user->id, $reservation->user->id);
    }

    /** @test */
    public function a_reservation_belongs_to_equipment()
    {
        $equipment = Equipment::factory()->create();
        $reservation = Reservation::factory()->create([
            'equipment_id' => $equipment->id,
        ]);

        $this->assertInstanceOf(Equipment::class, $reservation->equipment);
        $this->assertEquals($equipment->id, $reservation->equipment->id);
    }

    /** @test */
    public function a_reservation_has_a_status()
    {
        $reservation = Reservation::factory()->create([
            'status' => 'neschváleno',
        ]);

        $this->assertEquals('neschváleno', $reservation->status);
    }

    /** @test */
    public function a_reservation_has_start_and_end_dates()
    {
        $startDate = now()->addDay();
        $endDate = now()->addDays(5);

        $reservation = \App\Models\Reservation::factory()->create([
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $this->assertEquals(
            $startDate->toDateString(),
            $reservation->start_date->toDateString()
        );
        $this->assertEquals(
            $endDate->toDateString(),
            $reservation->end_date->toDateString()
        );
    }
}
