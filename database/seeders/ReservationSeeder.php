<?php

namespace Database\Seeders;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // create few reservations without factory
        $dateNow = Carbon::now()->format('Y-m-d');
        $endDate = Carbon::now()->addDays(2)->format('Y-m-d');
        $lateDate = Carbon::now()->subDays(5)->format('Y-m-d');
        $lateEndDate = Carbon::now()->subDays(2)->format('Y-m-d');
        $futureDate = Carbon::now()->addDays(2)->format('Y-m-d');
        $reservations = [
            [
                'equipment_id' => 1,
                // 'user_id' => 1,
                'status' => 'neschváleno',
                'comment' => '',
                'start_date' => $dateNow,
                'end_date' => $endDate,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 1,
                // 'user_id' => 1,
                'status' => 'schváleno',
                'comment' => 'Přines si tašku',
                'start_date' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 1,
                // 'user_id' => 1,
                'status' => 'neschváleno',
                'comment' => '',
                'start_date' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'end_date' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 2,
                // 'user_id' => 1,
                'status' => 'neschváleno',
                'comment' => '',
                'start_date' => $dateNow,
                'end_date' => $endDate,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 2,
                // 'user_id' => 1,
                'status' => 'schváleno',
                'comment' => 'Nutné mít vlastní obal',
                'start_date' => $dateNow,
                'end_date' => $endDate,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 4,
                // 'user_id' => 1,
                'status' => 'probíhá',
                'comment' => '',
                'start_date' => $dateNow,
                'end_date' => $endDate,
                'pickup_date' => $dateNow,
                'equipment_condition_start' => 'nové',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 3,
                // 'user_id' => 1,
                'status' => 'probíhá',
                'comment' => '',
                'start_date' => $lateDate,
                'end_date' => $lateEndDate,
                'pickup_date' => $lateDate,
                'equipment_condition_start' => 'nové',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 3,
                // 'user_id' => 1,
                'status' => 'schváleno',
                'comment' => '',
                'start_date' => $lateDate,
                'end_date' => $endDate,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 4,
                // 'user_id' => 1,
                'status' => 'schváleno',
                'comment' => '',
                'start_date' => $futureDate,
                'end_date' => $endDate,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'equipment_id' => 2,
                // 'user_id' => 1,
                'status' => 'archivováno',
                'comment' => 'V pořádku',
                'start_date' => $lateDate,
                'end_date' => $lateEndDate,
                'pickup_date' => $lateDate,
                'return_date' => $lateEndDate,
                'equipment_condition_start' => 'nové',
                'equipment_condition_end' => 'poškozené',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($reservations as $reservation) {
            Reservation::create($reservation);
        }
    }
}
