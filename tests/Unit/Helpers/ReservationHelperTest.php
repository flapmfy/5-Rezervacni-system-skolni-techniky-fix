<?php

namespace Tests\Unit\Helpers;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationHelperTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_an_array_for_reservation_issues()
    {
        $equipment = Equipment::factory()->create();
        $user = User::factory()->create();

        $reservation = Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'user_id' => $user->id,
            'status' => 'archivováno',
        ]);

        $issues = checkReservationIssues($reservation);

        $this->assertIsArray($issues);
    }

    /** @test */
    public function it_identifies_issues_with_late_returns()
    {
        $equipment = Equipment::factory()->create();
        $user = User::factory()->create();

        // Create a reservation that ended yesterday but was returned today
        $reservation = Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'user_id' => $user->id,
            'status' => 'archivováno',
            'end_date' => Carbon::yesterday()->format('Y-m-d'),
            'return_date' => Carbon::today()->format('Y-m-d'),
        ]);

        $issues = checkReservationIssues($reservation);

        // Check if the function returns something indicating a late return
        // Without assuming specific array keys
        $this->assertNotEquals([], $issues);
    }

    /** @test */
    public function it_identifies_issues_with_equipment_condition()
    {
        $equipment = Equipment::factory()->create();
        $user = User::factory()->create();

        // Create a reservation where condition deteriorated
        $reservation = Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'user_id' => $user->id,
            'status' => 'archivováno',
            'equipment_condition_start' => 'excellent',
            'equipment_condition_end' => 'damaged',
        ]);

        $issues = checkReservationIssues($reservation);

        // Check if the function returns something indicating a condition problem
        // Without assuming specific array keys
        $this->assertNotEquals([], $issues);
    }
}
