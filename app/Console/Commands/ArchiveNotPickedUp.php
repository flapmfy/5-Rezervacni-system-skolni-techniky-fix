<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Models\User;
use App\Notifications\ReservationDisapproved;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class ArchiveNotPickedUp extends Command
{
    protected $signature = 'reservations:archive-not-picked-up';

    protected $description = 'Archive approved reservations that were not picked up after half the reservation length';

    public function handle()
    {
        $reservations = Reservation::where('status', 'schváleno')
            ->get();

        foreach ($reservations as $reservation) {
            $startDate = Carbon::parse($reservation->start_date);
            $endDate = Carbon::parse($reservation->end_date);
            $totalDays = $startDate->diffInDays($endDate) + 1;
            $halfwayPoint = $startDate->addDays(ceil($totalDays / 2));
            $today = Carbon::now();

            if ($today >= $halfwayPoint) {
                $reservation->update([
                    'status' => 'archivováno',
                    'not_picked_up' => true,
                ]);
                Notification::route('mail', User::find($reservation->user_id)->email)->notify(new ReservationDisapproved($reservation));
                $this->info('Archived not picked up reservation ID: '.$reservation->id);
            }
        }

        $this->info('Checked and archived not picked up reservations!');
    }
}
