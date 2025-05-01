<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ], [
            'username.required' => 'Zadejte uživatelské jméno',
            'password.required' => 'Zadejte heslo',
        ]);

        $key = 'login:'.$request->username.$request->ip();

        // Check if rate limit is exceeded
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->with('flash', flash('error', 'Vypotřeboval jste 5 pokusů na přihlášení, zkuste to později.'));
        }

        // Attempt login
        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $user = Auth::user();

            RateLimiter::clear($key); // Clear rate limit on successful login
            $request->session()->regenerate();

            // Check if profile needs completion
            if ($user->needsProfileCompletion()) {
                return redirect()->route('profile.complete');
            }

            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended(route('user.reservations.active'));
        }

        // Increment the rate limit counter on failed login
        RateLimiter::increment($key);

        return back()->withErrors([
            'username' => 'Špatné jméno nebo heslo',
        ])->onlyInput('username');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }
}
