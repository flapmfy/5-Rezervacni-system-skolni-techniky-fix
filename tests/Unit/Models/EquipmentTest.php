<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipmentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function equipment_belongs_to_a_category()
    {
        $category = Category::factory()->create();
        $equipment = Equipment::factory()->create([
            'category_id' => $category->id,
        ]);

        $this->assertInstanceOf(Category::class, $equipment->category);
        $this->assertEquals($category->id, $equipment->category->id);
    }

    /** @test */
    public function equipment_belongs_to_an_owner()
    {
        $user = User::factory()->create();
        $equipment = Equipment::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->assertInstanceOf(User::class, $equipment->owner);
        $this->assertEquals($user->id, $equipment->owner->id);
    }

    /** @test */
    public function equipment_can_have_multiple_reservations()
    {
        $equipment = Equipment::factory()->create();
        Reservation::factory()->count(3)->create([
            'equipment_id' => $equipment->id,
        ]);

        $this->assertCount(3, $equipment->reservations);
        $this->assertInstanceOf(Reservation::class, $equipment->reservations->first());
    }

    /** @test */
    public function equipment_can_be_soft_deleted()
    {
        $equipment = Equipment::factory()->create();
        $equipmentId = $equipment->id;

        $equipment->delete();

        $this->assertNull(Equipment::find($equipmentId));
        $this->assertNotNull(Equipment::withTrashed()->find($equipmentId));
    }
}
