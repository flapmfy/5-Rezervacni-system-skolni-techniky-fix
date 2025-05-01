<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function notice()
    {
        $email = auth()->user()->email;

        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
        ]);
    }

    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();

        // Get the current user who just verified their email
        $user = auth()->user();

        // Find all admin users
        $admins = User::where('role', 'admin')->get();

        // Notify each admin
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\NewUserAwaitingApproval($user));
        }

        return to_route('login')
            ->with('flash', flash('success', 'Email byl úspěšně ověřen. Počkejte prosím na schválení administrátorem.'));
    }

    public function resend(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('flash', flash('success', 'Byl odeslán nový ověřovací email.'));
    }

    public function awaitingApproval()
    {
        return Inertia::render('Auth/AwaitingApproval');
    }
}
