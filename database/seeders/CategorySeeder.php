<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Kamery',
                'slug' => Str::slug('Kamery'),
            ],
            [
                'name' => 'Foťáky',
                'slug' => Str::slug('Foťáky'),
            ],
            [
                'name' => 'Mikrofony',
                'slug' => Str::slug('Mikrofony'),
            ],
            [
                'name' => 'Stativy',
                'slug' => Str::slug('Stativy'),
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
