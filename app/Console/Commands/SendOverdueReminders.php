<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Notifications\NotPickedUpAlert;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendOverdueReminders extends Command //Sends emails to users who had approved reservations starting YESTERDAY
{
    protected $signature = 'reservations:send-overdue';

    protected $description = 'Send reminders for overdue pickups';

    public function handle()
    {
        $yesterday = Carbon::yesterday()->format('Y-m-d');

        $reservations = Reservation::where('start_date', $yesterday)
            ->where('status', 'schváleno')
            ->with(['equipment', 'equipment.owner'])
            ->get();

        foreach ($reservations as $reservation) {
            Notification::route('mail', $reservation->user->email)
                ->notify(new NotPickedUpAlert($reservation));
        }

        $this->info('Overdue reminders sent successfully!');
    }
}
