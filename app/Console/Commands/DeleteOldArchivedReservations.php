<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteOldArchivedReservations extends Command
{
    protected $signature = 'reservations:delete-old-archived';

    protected $description = 'Delete archived reservations that are 4 years old or older';

    public function handle()
    {
        $fourYearsAgo = Carbon::now()->subYears(4)->format('Y-m-d');

        $reservations = Reservation::where('status', 'archivováno')
            ->where('end_date', '<=', $fourYearsAgo)
            ->get();

        foreach ($reservations as $reservation) {
            $reservation->forceDelete();
            $this->info('Deleted old archived reservation ID: '.$reservation->id);
        }

        $this->info('Old archived reservations deleted successfully!');
    }
}
