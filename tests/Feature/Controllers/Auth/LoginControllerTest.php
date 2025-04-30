<?php

namespace Tests\Feature\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function login_page_can_be_rendered()
    {
        $response = $this->get(route('login'));
        
        $response->assertSuccessful();
    }

    /** @test */
    public function user_cannot_login_with_incorrect_password()
    {
        $user = User::factory()->create();
        
        $response = $this->post(route('login.post'), [
            'username' => $user->uid,
            'password' => 'wrong-password'
        ]);
        
        $response->assertRedirect();
        $this->assertGuest();
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->get(route('auth.logout'));
        
        $response->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
