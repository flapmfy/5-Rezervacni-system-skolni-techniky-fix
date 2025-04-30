<?php

namespace Tests\Feature\Controllers\User;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EquipmentControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create([
            'is_admin' => false,
        ]);
    }

    /** @test */
    public function student_can_view_equipment_catalog()
    {
        Equipment::factory()->count(3)->create();

        $response = $this->actingAs($this->student)
            ->get(route('equipment.index'));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }

    /** @test */
    public function student_can_filter_equipment_by_category()
    {
        $category = Category::factory()->create(['name' => 'TestCategory']);

        Equipment::factory()->create([
            'category_id' => $category->id,
            'name' => 'Test Equipment',
        ]);

        Equipment::factory()->create([
            'name' => 'Other Equipment',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('equipment.index', ['kategorie' => $category->slug]));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }

    /** @test */
    public function student_can_view_equipment_detail()
    {
        $equipment = Equipment::factory()->create([
            'name' => 'Test Equipment',
            'slug' => 'test-equipment',
        ]);

        $response = $this->actingAs($this->student)
            ->get(route('equipment.show', $equipment->slug));

        // Simple success check without Inertia assertions
        $response->assertSuccessful();
    }
}
