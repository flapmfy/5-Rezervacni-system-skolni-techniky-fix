<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 day', '+2 days');
        $endDate   = $this->faker->dateTimeBetween($startDate, '+1 week');
        return [
            'user_id'                 => User::factory(),
            'equipment_id'            => Equipment::factory(),
            'status'                  => 'neschváleno',
            'comment'                 => $this->faker->sentence,
            'user_comment'            => $this->faker->sentence,
            'equipment_condition_start'=> $this->faker->sentence,
            'equipment_condition_end'  => $this->faker->sentence,
            'start_date'              => $startDate->format('Y-m-d'),
            'end_date'                => $endDate->format('Y-m-d'),
            'pickup_date'             => null,
            'return_date'             => null,
        ];
    }
}
