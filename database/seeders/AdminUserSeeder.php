<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'username' => 'wachtl',
            'email' => 'wachtl@spseplzen.cz',
            'password' => Hash::make('heslo'),
            'first_name' => 'Zdeněk',
            'last_name' => 'Wachtl',
            'class' => 'D30',
            'role' => 'admin',
            'email_verified_at' => now(),
            'approved_at' => now(),
        ]);
    }
}
