<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $rules = [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'role' => 'required|string|in:student,admin',
            'default_room' => 'nullable|string|max:255',
        ];

        $messages = [
            'username.required' => 'Zadejte uživatelské jméno',
            'username.unique' => 'Toto uživatelské jméno je již zaregistrováno',
            'email.required' => 'Zadejte email',
            'email.email' => 'Zadejte platný email',
            'email.unique' => 'Tento email je již zaregistrován',
            'password.required' => 'Zadejte heslo',
            'password.min' => 'Heslo musí mít alespoň 8 znaků',
            'password.confirmed' => 'Hesla se neshodují',
            'first_name.required' => 'Zadejte jméno',
            'last_name.required' => 'Zadejte příjmení',
            'role.required' => 'Vyberte roli',
            'role.in' => 'Neplatná role',
            'default_room.required' => 'Zadejte třídu/místo výdeje',
        ];

        $request->validate($rules, $messages);

        $userData = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'role' => $request->role,
            'default_room' => $request->default_room,
        ];

        $user = User::create($userData);

        event(new Registered($user));

        auth()->login($user);

        return to_route('verification.notice')
            ->with('flash', flash('success', 'Účet byl vytvořen. Ověřte svůj email pro aktivaci účtu.'));
    }
}
