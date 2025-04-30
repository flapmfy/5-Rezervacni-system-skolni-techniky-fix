<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActionsControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create([
            'is_admin' => true
        ]);
    }

    /** @test */
    public function admin_can_view_actions_page()
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.actions'));
        
        $response->assertSuccessful();
    }
}
