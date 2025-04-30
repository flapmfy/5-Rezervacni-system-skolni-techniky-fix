<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class ReservationDisapproved extends Notification implements ShouldQueue
{
    use Queueable;
    
    // Uložíme pouze primitivní hodnoty, abychom se vyhnuli rehydraci modelu
    protected $equipmentName;
    protected $startDate;
    protected $endDate;
    protected $room;
    protected $teacherName;
    protected $comment;

    public function __construct($reservation, $declineMessage)
    {
        // Snapshot dat ze zákazníka před smazáním rezervace:
        $this->equipmentName = $reservation->equipment->name;
        $this->startDate      = $reservation->start_date;
        $this->endDate        = $reservation->end_date;
        $this->room           = $reservation->equipment->room;
        $this->teacherName    = $reservation->equipment->owner->name;
        // Zde získáváme komentář přímo z rezervace, ne z vybavení
        $this->comment        = $declineMessage;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Rezervace zamítnuta')
            ->line('Vaše rezervace byla zamítnuta.')
            ->line('Důvod zamítnutí: ' . $this->comment)
            ->line('Zařízení: ' . $this->equipmentName)
            ->line('V termínu: ' .
                Carbon::parse($this->startDate)->format('d.m.Y') .
                ' - ' .
                Carbon::parse($this->endDate)->format('d.m.Y'))
            ->line('Zodpovědný vyučující: ' . $this->teacherName)
            ->line('Místnost: ' . $this->room);
    }
}
