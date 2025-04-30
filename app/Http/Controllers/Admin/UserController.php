<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AccountApproved;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $pendingUsers = User::whereNull('approved_at')
            ->whereNotNull('email_verified_at')
            ->latest()
            ->get();
            
        return Inertia::render('Admin/PendingUsers', [
            'pendingUsers' => $pendingUsers->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('d.m.Y H:i'),
                ];
            }),
        ]);
    }
    
    public function approve(User $user)
    {
        $user->approved_at = now();
        $user->save();
        
        $user->notify(new AccountApproved());
        
        return back()->with('flash', flash('success', 'Uživatel byl úspěšně schválen.'));
    }
}
