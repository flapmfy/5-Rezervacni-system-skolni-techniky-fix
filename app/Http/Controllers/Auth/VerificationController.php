<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function notice()
    {
        return Inertia::render('Auth/VerifyEmail');
    }

    public function verify(EmailVerificationRequest $request)
    {
        $request->fulfill();
        
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
