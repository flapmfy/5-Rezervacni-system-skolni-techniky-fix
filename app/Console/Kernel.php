<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('reservations:send-overdue')
            ->dailyAt('00:01');

        //přidat return reminder

        $schedule->command('reservations:delete-expired')
            ->dailyAt('00:01');

        $schedule->command('reservations:archive-not-picked-up')
            ->dailyAt('00:01');

        $schedule->command('reservations:delete-old-archived')
            ->dailyAt('00:01');

        $schedule->command('telescope:prune')
            ->dailyAt('00:01');
    }
}
