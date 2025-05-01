<?php

namespace Tests\Feature\Controllers\User;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationsAdvancedTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    private User $admin;

    private Equipment $equipment;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create([
            'is_admin' => false,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $this->equipment = Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'quantity' => 2,
        ]);
    }

    /** @test */
    public function student_cannot_reserve_equipment_for_past_dates()
    {
        // Use tomorrow as start date and day after as end date to clearly meet validation
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $today = Carbon::today()->format('Y-m-d');

        $response = $this->actingAs($this->student)
            ->post(route('user.reservations.store'), [
                'equipmentId' => $this->equipment->id,
                'startDate' => $yesterday,
                'endDate' => $today,
                'comment' => 'Past reservation attempt',
            ]);

        // This should fail validation
        $response->assertRedirect();

        // The database should not contain this reservation
        $this->assertDatabaseMissing('reservations', [
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'start_date' => $yesterday,
        ]);
    }

    /** @test */
    public function student_can_view_accepted_reservations()
    {
        Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'schváleno',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('user.reservations.accepted'));

        $response->assertSuccessful();
    }

    /** @test */
    public function student_can_view_waiting_reservations()
    {
        Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'neschváleno',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('user.reservations.waiting'));

        $response->assertSuccessful();
    }

    /** @test */
    public function student_can_view_archived_reservations()
    {
        Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'archivováno',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('user.reservations.archived'));

        $response->assertSuccessful();
    }
}
