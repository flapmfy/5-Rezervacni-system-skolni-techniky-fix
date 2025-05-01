<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewUserAwaitingApproval extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nový uživatel čeká na schválení')
            ->greeting('Dobrý den!')
            ->line("Uživatel {$this->user->name} ověřil svůj email a čeká na schválení.")
            ->line("Email: {$this->user->email}")
            ->action('Přejít do administrace', url(route('admin.users.pending')))
            ->line('Děkujeme za používání naší aplikace.');
    }
}
