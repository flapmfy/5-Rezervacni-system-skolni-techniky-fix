<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AccountApproved;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function usersPending(Request $request)
    {
        $filters = $request->only(['vyhledavani']);
        $query = User::whereNull('approved_at')
            ->whereNotNull('email_verified_at')
            ->latest();

        if (!empty($filters['vyhledavani'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('username', 'like', '%' . $filters['vyhledavani'] . '%')
                    ->orWhere('email', 'like', '%' . $filters['vyhledavani'] . '%')
                    ->orWhere('first_name', 'like', '%' . $filters['vyhledavani'] . '%')
                    ->orWhere('last_name', 'like', '%' . $filters['vyhledavani'] . '%');
            });
        }

        $paginatedUsers = $query->paginate(10)->withQueryString()->through(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'default_room' => $user->default_room,
                'created_at' => $user->created_at,
            ];
        });
            
        return Inertia::render('Admin/Users/PendingUsers', [
            'pendingUsers' => $paginatedUsers,
            'filters' => $filters,
        ]);
    }
    
    public function approve($id)
    {
        $user = User::findOrFail($id);
        if ($user->approved_at) {
            return back()->with('flash', flash('error', 'Uživatel již byl schválen.'));
        }
        $user->approved_at = now();
        $user->save();
        
        $user->notify(new AccountApproved());
        
        return back()->with('flash', flash('success', 'Uživatel byl úspěšně schválen.'));
    }

    public function decline($id)
    {
        $user = User::findOrFail($id);
        if ($user->approved_at) {
            return back()->with('flash', flash('error', 'Uživatel již byl schválen.'));
        }
        $user->delete();
        
        return back()->with('flash', flash('success', 'Uživatelovi byl odepřen přístup.'));
    }
}
