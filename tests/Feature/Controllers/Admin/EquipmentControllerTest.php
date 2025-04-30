<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class EquipmentControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'is_admin' => true
        ]);
        $this->category = Category::factory()->create();
    }

    /** @test */
    public function admin_can_view_equipment_index()
    {
        Equipment::factory()->count(3)->create([
            'user_id' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.equipment.index'));
        
        $response->assertSuccessful();
    }

    /** @test */
    public function admin_can_filter_equipment_by_search_term()
    {
        Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Test Equipment'
        ]);

        Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'name' => 'Other Equipment'
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.equipment.index', ['vyhledavani' => 'Test']));
        
        $response->assertSuccessful();
    }

    /** @test */
    public function admin_can_filter_equipment_by_category()
    {
        Equipment::factory()->create([
            'user_id' => $this->admin->id,
            'category_id' => $this->category->id
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.equipment.index', ['kategorie' => $this->category->slug]));
        
        $response->assertSuccessful();
    }

    /** @test */
    public function admin_can_view_create_equipment_form()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.equipment.create'));
        
        $response->assertSuccessful();
    }

    /** @test */
    public function admin_can_view_edit_equipment_form()
    {
        $equipment = Equipment::factory()->create([
            'user_id' => $this->admin->id
        ]);
        
        $response = $this->actingAs($this->admin)
            ->get(route('admin.equipment.edit', $equipment->slug));
        
        $response->assertSuccessful();
    }
}
