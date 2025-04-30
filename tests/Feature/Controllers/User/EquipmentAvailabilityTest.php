<?php

namespace Tests\Feature\Controllers\User;

use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipmentAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create([
            'is_admin' => false,
        ]);

        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);
    }

    /** @test */
    public function student_can_filter_equipment_by_availability()
    {
        // Create fully available equipment
        $availableEquipment = Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Available Equipment',
            'quantity' => 2,
        ]);

        // Create partially reserved equipment
        $partialEquipment = Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Partial Equipment',
            'quantity' => 2,
        ]);

        Reservation::factory()->create([
            'equipment_id' => $partialEquipment->id,
            'status' => 'schváleno',
            'start_date' => now()->addDay()->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        // Create fully booked equipment
        $bookedEquipment = Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Booked Equipment',
            'quantity' => 1,
        ]);

        Reservation::factory()->create([
            'equipment_id' => $bookedEquipment->id,
            'status' => 'schváleno',
            'start_date' => now()->addDay()->format('Y-m-d'),
            'end_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        // Test filtering for available equipment
        $response = $this->actingAs($this->student)
            ->get(route('equipment.index', ['dostupnost' => '1'])); // 1 = fully available

        $response->assertSuccessful();

        // Test filtering for partially available equipment
        $response = $this->actingAs($this->student)
            ->get(route('equipment.index', ['dostupnost' => '2'])); // 2 = partially available

        $response->assertSuccessful();

        // Test filtering for unavailable equipment
        $response = $this->actingAs($this->student)
            ->get(route('equipment.index', ['dostupnost' => '3'])); // 3 = fully booked

        $response->assertSuccessful();
    }

    /** @test */
    public function student_can_filter_equipment_by_multiple_criteria()
    {
        $category = \App\Models\Category::factory()->create(['name' => 'Test Category']);

        // Create equipment matching multiple filters
        Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Test Equipment',
            'manufacturer' => 'Test Manufacturer',
            'category_id' => $category->id,
            'room' => 'A101',
        ]);

        // Create equipment not matching all filters
        Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Other Equipment',
            'manufacturer' => 'Other Manufacturer',
            'room' => 'B202',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('equipment.index', [
                'kategorie' => $category->slug,
                'vyhledavani' => 'Test',
                'vyrobce' => 'Test Manufacturer',
                'mistnost' => 'A101',
            ]));

        $response->assertSuccessful();
    }
}
