<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Equipment;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    private function getCategories()
    {
        return Category::select('id', 'name', 'slug')->get();
    }

    public function index(Request $request)
    {
        $filters = $request->only(['kategorie', 'vyhledavani', 'vyrobce', 'mistnost', 'dostupnost', 'razeni', 'pouze_novinky']);
        $EQUIPMENT_PER_PAGE = 12;
        $equipmentCount = Equipment::count();

        $query = Equipment::query()
            ->select(['id', 'category_id', 'name', 'image_path', 'manufacturer', 'description', 'created_at', 'deleted_at', 'slug', 'room', 'quantity'])
            ->with('category:id,name,slug');

        // Filtrování podle kategorie
        if (! empty($filters['kategorie'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['kategorie']));
        }

        // Filtrování podle textu (název nebo popis)
        if (! empty($filters['vyhledavani'])) {
            $search = $filters['vyhledavani'];
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
            );
        }

        // Filtrování podle výrobce
        if (! empty($filters['vyrobce'])) {
            $query->where('manufacturer', $filters['vyrobce']);
        }

        // Filtrování podle místnosti
        if (! empty($filters['mistnost'])) {
            $query->where('room', $filters['mistnost']);
        }

        // Filtrování pouze novinky (posledních 7 dní)
        if (isset($filters['pouze_novinky']) && $filters['pouze_novinky'] === 'true') {
            $query->where('created_at', '>=', now()->subDays(7));
        }

        // Řazení
        if (! empty($filters['razeni'])) {
            switch ($filters['razeni']) {
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'date_desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'date_asc':
                    $query->orderBy('created_at', 'asc');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }
        } else {
            // Výchozí řazení podle názvu
            $query->orderBy('name', 'asc');
        }

        $equipment = $query
            ->paginate($EQUIPMENT_PER_PAGE)
            ->withQueryString();

        // Přidání dostupnosti a URL obrázku ke každému vybavení
        $equipment->getCollection()->transform(function ($item) {
            $item->availability = self::checkAvailability($item->id); // Přidání dostupnosti
            $item->image_path = $item->image_path ? Storage::url($item->image_path) : null; // Přidání URL obrázku

            // Filtrování podle dostupnosti - provádíme to po načtení dat, protože dostupnost je vypočítaná hodnota
            if (request()->has('dostupnost') && request()->input('dostupnost') != '') {
                if ($item->availability != (int) request()->input('dostupnost')) {
                    return null;
                }
            }

            return $item;
        });

        // Odstraníme případné null hodnoty z kolekce (po filtrování dostupnosti)
        $equipment->setCollection($equipment->getCollection()->filter()->values());

        return Inertia::render('Student/Catalog/Index', [
            'categories' => $this->getCategories(),
            'filters' => $filters,
            'equipment' => Inertia::defer(fn () => $equipment)->merge(),
            'equipmentCount' => $equipmentCount < $EQUIPMENT_PER_PAGE ? $equipmentCount : $EQUIPMENT_PER_PAGE,
        ]);
    }

    public function show($slug)
    {
        $equipment = Equipment::with(['category'])
            ->where('slug', $slug)->firstOrFail();

        // Převod pole stringů na pole čísel
        $disabledDays = array_map('intval', explode(',', $equipment->owner->disabled_days));

        $equipmentReservations = $equipment->reservations->where('status', '!=', 'archivováno')
            ->map(fn ($reservation) => [
                'id' => $reservation->id,
                'user_name' => $reservation->user->first_name.' '.$reservation->user->last_name,
                'status' => $reservation->status,
                'user_comment' => $reservation->user_comment,
                'start_date' => $reservation->start_date,
                'end_date' => $reservation->end_date,
            ])->values();

        return Inertia::render('Student/Catalog/Show', [
            'equipment' => array_merge($equipment->toArray(), [
                'image_path' => $equipment->image_path ? Storage::url($equipment->image_path) : null,
                'owner' => $equipment->owner->first_name.' '.$equipment->owner->last_name,
            ]),
            'category' => $equipment->category,
            'bookedRanges' => $equipmentReservations,
            'disabledDays' => $disabledDays,
        ]);
    }

    public static function checkAvailability($equipmentId)
    {
        // Get the equipment details
        $equipment = Equipment::findOrFail($equipmentId);

        // Set the date range for the next 7 days
        $startDate = Carbon::now();
        $endDate = $startDate->copy()->addDays(7);

        // Fetch overlapping reservations for the date range
        $reservations = Reservation::where('equipment_id', $equipmentId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->where('status', '!=', 'archivováno')
            ->get();

        // Analyze reservations day by day
        $days = [];
        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $currentDate = $date->format('Y-m-d');
            $overlappingCount = 0;

            foreach ($reservations as $reservation) {
                if ($reservation->start_date <= $currentDate && $reservation->end_date >= $currentDate) {
                    $overlappingCount++;
                }
            }

            $days[$currentDate] = $overlappingCount;
        }

        // Count fully booked days
        $fullyBookedDays = 0;
        foreach ($days as $day => $count) {
            if ($count >= $equipment->quantity) {
                $fullyBookedDays++;
            }
        }

        // Determine availability
        if (max($days) === 0) {
            return 1; // Fully Available: No reservations at all
        } elseif ($fullyBookedDays >= 2) {
            return 3; // Fully Unavailable: At least 2 days are fully booked
        } else {
            return 2; // Partially Reserved: At least one reservation, but less than 2 fully booked days
        }
    }
}
