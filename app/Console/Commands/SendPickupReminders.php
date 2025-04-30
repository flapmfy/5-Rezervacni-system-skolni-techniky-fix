<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use App\Notifications\PickupReminder;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendPickupReminders extends Command //Sends emails to users who have approved reservations starting TOMORROW
{
    protected $signature = 'reservations:send-reminders';

    protected $description = 'Send pickup reminders for tomorrow\'s reservations';

    public function handle()
    {
        $tomorrow = Carbon::tomorrow()->format('Y-m-d');

        $reservations = Reservation::where('start_date', $tomorrow)
            ->where('status', 'schváleno')
            ->with(['equipment', 'equipment.owner'])
            ->get();

        foreach ($reservations as $reservation) {
            Notification::route('mail', $reservation->user->email)
                ->notify(new PickupReminder($reservation));
        }

        $this->info('Reminder emails sent successfully!');
    }
}
