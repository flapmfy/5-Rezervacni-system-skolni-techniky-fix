<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('Student/Profile', [
            'defaultRoom' => $user->default_room,
        ]);
    }
    
    public function update(Request $request)
    {
        $request->validate([
            'default_room' => 'nullable|string|max:255',
        ], [
            'default_room.max' => 'Název třídy je příliš dlouhý.',
        ]);
        
        $user = Auth::user();
        $user->default_room = $request->default_room;
        $user->save();
        
        return back()->with('flash', flash('success', 'Nastavení bylo úspěšně aktualizováno.'));
    }
    
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|min:8|confirmed',
        ], [
            'current_password.current_password' => 'Zadejte prosím správné heslo.',
            'password.required' => 'Zadejte prosím nové heslo.',
            'password.min' => 'Heslo musí mít alespoň 8 znaků.',
            'password.confirmed' => 'Hesla se neshodují.',
        ]);
        
        $user = Auth::user();
        $user->password = Hash::make($request->password);
        $user->save();
        
        return back()->with('flash', flash('success', 'Heslo bylo úspěšně změněno.'));
    }
}
