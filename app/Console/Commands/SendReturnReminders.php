<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendReturnReminders extends Command //pošle upozornění že uživatel měl včera vrátit vybavení
{
    protected $signature = 'reservations:send-return';

    protected $description = 'Send reminders for equipment that should have been returned';

    public function handle()
    {
        $yesterday = Carbon::yesterday()->format('Y-m-d');

        $reservations = Reservation::where('end_date', $yesterday)
            ->where('status', 'probíhá')
            ->with(['equipment', 'equipment.owner'])
            ->get();

        foreach ($reservations as $reservation) {
            Notification::route('mail', $reservation->user->email)
                ->notify(new NotReturnedAlert($reservation));
        }

        $this->info('Return reminders sent successfully!');
    }
}
