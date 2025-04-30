<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_category_has_a_name()
    {
        $category = Category::factory()->create([
            'name' => 'Notebooky',
            'slug' => 'notebooky',
        ]);

        $this->assertEquals('Notebooky', $category->name);
        $this->assertEquals('notebooky', $category->slug);
    }

    /** @test */
    public function a_category_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
        ]);

        $this->assertInstanceOf(User::class, $category->user);
        $this->assertEquals($user->id, $category->user->id);
    }

    /** @test */
    public function a_category_can_have_multiple_equipment()
    {
        $category = Category::factory()->create();
        Equipment::factory()->count(3)->create([
            'category_id' => $category->id,
        ]);

        $this->assertCount(3, $category->equipment);
        $this->assertInstanceOf(Equipment::class, $category->equipment->first());
    }

    /** @test */
    public function duplicate_category_names_causes_query_exception()
    {
        $name = 'UniqueCategory';
        Category::factory()->create([
            'name' => $name,
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Category::factory()->create([
            'name' => $name,
        ]);
    }
}
