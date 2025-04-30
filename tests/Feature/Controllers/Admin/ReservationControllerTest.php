<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationsControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $student;
    private Equipment $equipment;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'is_admin' => true
        ]);
        
        $this->student = User::factory()->create([
            'is_admin' => false
        ]);
        
        $this->equipment = Equipment::factory()->create([
            'user_id' => $this->admin->id
        ]);
    }

    /** @test */
    public function admin_can_view_waiting_reservations()
    {
        Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'neschváleno'
        ]);
        
        $response = $this->actingAs($this->admin)
            ->get(route('admin.reservations.waiting'));
        
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Reservations/Waiting/Index')
            ->has('waitingReservations.data', 1)
        );
    }

    /** @test */
    public function admin_can_approve_waiting_reservation()
    {
        $reservation = Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'neschváleno'
        ]);
        
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.reservations.waiting.accept'), [
                'id' => $reservation->id,
                'message' => 'Approved message'
            ]);
        
        $response->assertRedirect(route('admin.reservations.waiting'));
        $response->assertSessionHas('flash');
        
        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'schváleno'
        ]);
    }

    /** @test */
    public function admin_can_end_active_reservation()
    {
        $reservation = Reservation::factory()->create([
            'equipment_id' => $this->equipment->id,
            'user_id' => $this->student->id,
            'status' => 'probíhá'
        ]);
        
        $response = $this->actingAs($this->admin)
            ->patch(route('admin.reservations.active.end'), [
                'id' => $reservation->id,
                'message' => 'Return message',
                'equipmentCondition' => 'Good condition'
            ]);
        
        $response->assertRedirect(route('admin.reservations.active'));
        $response->assertSessionHas('flash');
        
        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'archivováno'
        ]);
    }
    
    /** @test */
    public function admin_can_view_calendar()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.calendar'));
        
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Calendar')
        );
    }
}
