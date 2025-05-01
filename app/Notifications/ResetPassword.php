<?php

namespace App\Notifications;

use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPassword extends Notification
{
    use Queueable;

    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Obnovení hesla')
            ->line('Tento e-mail jste obdrželi, protože jsme dostali žádost o obnovení hesla pro Váš účet.')
            ->action('Obnovit heslo', $url)
            ->line('Tento odkaz pro obnovení hesla vyprší za 60 minut.')
            ->line('Pokud jste o obnovení hesla nežádali, není třeba provádět žádnou akci.');
    }
}
