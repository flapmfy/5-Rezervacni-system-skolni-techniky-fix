<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Models\User;
use App\Notifications\ReservationDisapproved;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class DeleteExpiredReservations extends Command
{
    protected $signature = 'reservations:delete-expired';

    protected $description = 'Delete unaccepted reservations that have expired';

    public function handle()
    {
        $yesterday = Carbon::yesterday()->format('Y-m-d');

        $reservations = Reservation::where('status', 'neschváleno')
            ->where('start_date', '<=', $yesterday)
            ->get();

        foreach ($reservations as $reservation) {
            Notification::route('mail', User::find($reservation->user_id)->email)->notify(new ReservationDisapproved($reservation));
            $reservation->delete();
            $this->info('Deleted expired reservation ID: '.$reservation->id);
        }

        $this->info('Expired reservations deleted successfully!');
    }
}
