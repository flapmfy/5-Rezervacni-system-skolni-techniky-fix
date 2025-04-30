<?php

namespace Tests\Unit\Helpers;

use Tests\TestCase;

class FlashHelperTest extends TestCase
{
    /** @test */
    public function it_creates_flash_message_with_correct_structure()
    {
        $result = flash('success', 'Test message');

        $this->assertEquals('success', $result['type']);
        $this->assertEquals('Test message', $result['message']);
        $this->assertArrayHasKey('timestamp', $result);
    }

    /** @test */
    public function it_accepts_different_message_types()
    {
        $types = ['success', 'error', 'warning', 'info'];

        foreach ($types as $type) {
            $result = flash($type, 'Test message');
            $this->assertEquals($type, $result['type']);
        }
    }
}
