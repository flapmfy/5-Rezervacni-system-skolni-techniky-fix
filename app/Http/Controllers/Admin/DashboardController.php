<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $chartLength = $request->days;

        $popularEquipment = Auth::user()->equipment()
            ->select(['id', 'slug', 'name', 'image_path'])
            ->withCount('reservations')
            ->orderBy('reservations_count', 'desc')
            ->limit(3)
            ->get();

        $popularEquipment->transform(function ($item) {
            $item->image_path = $item->image_path ? Storage::url($item->image_path) : null; // Přidání URL obrázku

            return $item;
        });

        // Get data for the last 7 days
        $startDate = Carbon::now()->subDays($chartLength ? $chartLength : 7)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $chartData = Reservation::query()
            ->whereHas('equipment', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->groupBy(function ($reservation) {
                return $reservation->created_at->format('Y-m-d');
            })
            ->map(function ($reservations, $date) {
                return [
                    'date' => $date,
                    'count' => $reservations->count(),
                ];
            })
            ->values();

        // Fill in any missing dates with zero counts
        $completeChartData = collect();
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $dateStr = $date->format('Y-m-d');
            $existingData = $chartData->firstWhere('date', $dateStr);

            $completeChartData->push([
                'date' => $dateStr,
                'count' => $existingData ? $existingData['count'] : 0,
            ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'popularEquipment' => $popularEquipment,
            'chartData' => $completeChartData,
        ]);
    }
}
