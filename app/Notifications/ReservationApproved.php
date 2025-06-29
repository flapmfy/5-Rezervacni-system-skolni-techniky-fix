<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reservation;

    public function __construct(Reservation $reservation)
    {
        $this->reservation = $reservation;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $equipment = $this->reservation->equipment;

        return (new MailMessage)
            ->subject('Rezervace schválena')
            ->line('Vaše rezervace byla schválena.')
            ->line('Zařízení: '.$equipment->name)
            ->line('V termínu: '.\Carbon\Carbon::parse($this->reservation->start_date)->format('d.m.Y').
            ' - '.\Carbon\Carbon::parse($this->reservation->end_date)->format('d.m.Y'))
            ->line('Zodpovědný vyučující: '.$equipment->owner->name)
            ->line('Vyzvedněte si ji prosím v místnosti: '.$equipment->room);
    }
}
