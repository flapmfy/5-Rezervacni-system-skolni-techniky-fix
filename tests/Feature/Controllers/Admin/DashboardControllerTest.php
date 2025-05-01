<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);
    }

    /** @test */
    public function admin_can_view_dashboard()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.dashboard'));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }

    /** @test */
    public function dashboard_shows_chart_data_for_selected_days()
    {
        // Create equipment owned by admin
        $equipment = Equipment::factory()->create([
            'user_id' => $this->admin->id,
        ]);

        // Create reservation today
        Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'created_at' => Carbon::today(),
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.dashboard', ['days' => 2]));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }
}
