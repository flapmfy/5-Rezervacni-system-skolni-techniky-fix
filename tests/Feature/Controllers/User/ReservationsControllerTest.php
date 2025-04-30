<?php

namespace Tests\Feature\Controllers\User;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationsControllerTest extends TestCase
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
    public function student_can_view_active_reservations()
    {
        Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'probíhá',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('user.reservations.active'));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }
}
