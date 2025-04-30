<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EquipmentFactory extends Factory
{
    protected $model = Equipment::class;

    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'user_id' => User::factory(),      // vlastník vybavení
            'category_id' => Category::factory(),
            'image_path' => null,
            'slug' => Str::slug($name.' '.$this->faker->word),
            'manufacturer' => $this->faker->company,
            'name' => $name,
            'description' => $this->faker->paragraph,
            'room' => $this->faker->bothify('Room ##'),
            'quantity' => $this->faker->numberBetween(1, 10),
        ];
    }
}
