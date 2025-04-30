<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // For Inertia to work in tests
        $this->withoutVite();
        URL::forceRootUrl('http://localhost');
    }
    
    /**
     * Make an Inertia request
     */
    protected function inertiaGet($uri, array $headers = [])
    {
        return $this->get($uri, array_merge([
            'X-Inertia' => 'true',
            'X-Inertia-Version' => '',
        ], $headers));
    }
}
