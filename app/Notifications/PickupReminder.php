<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PickupReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $equipmentName;

    protected $startDate;

    protected $endDate;

    protected $room;

    protected $teacherName;

    public function __construct($reservation)
    {
        $this->equipmentName = $reservation->equipment->name;
        $this->startDate = $reservation->start_date;
        $this->endDate = $reservation->end_date;
        $this->room = $reservation->equipment->room;
        $this->teacherName = $reservation->equipment->owner->name;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Připomenutí vyzvednutí rezervace')
            ->line('Připomínáme, že zítra si můžete vyzvednout vaši rezervaci.')
            ->line('Zařízení: '.$this->equipmentName)
            ->line('V termínu: '.\Carbon\Carbon::parse($this->startDate)->format('d.m.Y').
            ' - '.\Carbon\Carbon::parse($this->endDate)->format('d.m.Y'))
            ->line('Zodpovědný vyučující: '.$this->teacherName)
            ->line('Vyzvedněte si ji prosím v místnosti: '.$this->room);
    }
}
