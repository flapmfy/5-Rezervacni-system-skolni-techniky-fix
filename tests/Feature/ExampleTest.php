<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    /** @test */
    /** @test */
    public function guest_user_is_redirected_to_login_page()
    {
        $response = $this->get('/');

        $response->assertStatus(302);
        $response->assertRedirect('/prihlaseni');
    }
}
