<?php

namespace Tests\Unit\Services;

use App\Http\Controllers\User\EquipmentController;
use App\Models\Equipment;
use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityServiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_fully_available_when_no_reservations_exist()
    {
        $equipment = Equipment::factory()->create(['quantity' => 1]);
        
        $availability = EquipmentController::checkAvailability($equipment->id);
        
        $this->assertEquals(1, $availability); // 1 = Plně dostupné
    }

    /** @test */
    public function it_returns_partially_available_when_some_days_are_reserved()
    {
        $equipment = Equipment::factory()->create(['quantity' => 2]);
        
        // Vytvoření rezervace na zítřek
        Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
            'status' => 'schváleno',
        ]);
        
        $availability = EquipmentController::checkAvailability($equipment->id);
        
        $this->assertEquals(2, $availability); // 2 = Částečně rezervované
    }

    /** @test */
    public function it_returns_unavailable_when_fully_booked()
    {
        $equipment = Equipment::factory()->create(['quantity' => 1]);
        
        // Vytvoření rezervace na příští dva dny
        Reservation::factory()->create([
            'equipment_id' => $equipment->id,
            'start_date' => now()->addDay()->toDateString(),
            'end_date' => now()->addDays(2)->toDateString(),
            'status' => 'schváleno',
        ]);
        
        $availability = EquipmentController::checkAvailability($equipment->id);
        
        $this->assertEquals(3, $availability); // 3 = Plně nedostupné
    }
}
