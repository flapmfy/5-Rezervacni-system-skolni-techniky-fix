<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActionsController extends Controller
{
    public function index()
    {
        $defaultRoom = Auth::user()->default_room;
        $disabledDays = Auth::user()->disabled_days;

        return Inertia::render('Admin/Actions', [
            'defaultRoom' => $defaultRoom,
            'disabledDays' => $disabledDays,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'default_room' => 'nullable|string|max:255',
            'disabled_days' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if (empty($value)) {
                        return;
                    }

                    $days = array_map('trim', explode(',', $value));

                    foreach ($days as $day) {
                        if (! is_numeric($day) || $day < 1 || $day > 5) {
                            $fail('Dny musí být čísla mezi 1 a 5 oddělená čárkami.');

                            return;
                        }
                    }
                },
            ],
        ]);

        // Zpracování disabled_days - odstranění duplicit
        $disabledDays = $request->disabled_days;
        if (! empty($disabledDays)) {
            // Rozdělení do pole, převod na čísla, odstranění duplicit a znovu spojení
            $daysArray = array_map('intval', explode(',', $disabledDays));
            $uniqueDaysArray = array_unique($daysArray);
            $disabledDays = implode(',', $uniqueDaysArray);
        }

        User::where('id', Auth::user()->id)->update([
            'default_room' => $request->default_room,
            'disabled_days' => $disabledDays,
        ]);

        return back()->with('flash', flash('success', 'Nastavení bylo aktualizováno'));
    }
}
