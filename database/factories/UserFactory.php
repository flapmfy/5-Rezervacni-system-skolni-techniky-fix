<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'first_name'    => $this->faker->firstName,
            'last_name'     => $this->faker->lastName,
            'username'      => $this->faker->unique()->userName,
            'email'         => $this->faker->unique()->safeEmail,
            'password'      => bcrypt('password'),
            'class'         => $this->faker->word,
            'is_admin'      => $this->faker->boolean,
            'default_room'  => $this->faker->word,
            'disabled_days' => null,
        ];
    }
}
