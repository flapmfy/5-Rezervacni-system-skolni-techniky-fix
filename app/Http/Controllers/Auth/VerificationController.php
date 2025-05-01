<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerificationController extends Controller
{
    public function notice()
    {
        return Inertia::render('Auth/VerifyEmail');
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
