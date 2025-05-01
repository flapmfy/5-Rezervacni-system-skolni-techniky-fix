<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessEquipmentImage;
use App\Models\Category;
use App\Models\Equipment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class EquipmentController extends Controller
{
    private function getCategories()
    {
        return Category::select('id', 'name', 'slug')->get();
    }

    public static function createUniqueSlug($name, $manufacturer)
    {
        // Create the base slug from name and manufacturer
        $baseSlug = Str::slug($name.' '.$manufacturer);
        $slug = $baseSlug;
        $counter = 1;

        // Keep checking until we find a unique slug
        while (Equipment::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['kategorie', 'vyhledavani', 'zobrazit_smazane', 'od_popularnich']);
        $trashedCount = Auth::user()->equipment()->onlyTrashed()->count();

        $query = Auth::user()->equipment()
            ->select(['id', 'slug', 'category_id', 'name', 'quantity', 'created_at', 'updated_at', 'deleted_at', 'image_path'])
            ->with('category:id,name,slug')
            ->withCount('reservations')
            ->withCount([
                'reservations as active_reservations_count' => function ($query) {
                    $query->where('status', 'schváleno');
                },
                'reservations as waiting_reservations_count' => function ($query) {
                    $query->where('status', 'neschváleno');
                },
            ]);

        if (! empty($filters['zobrazit_smazane'])) {
            $query->onlyTrashed();
        }

        if (! empty($filters['kategorie'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['kategorie']));
        }

        if (! empty($filters['vyhledavani'])) {
            $search = $filters['vyhledavani'];
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
            );
        }

        // Apply ordering based on the "od_popularnich" filter.
        if (! empty($filters['od_popularnich']) && $filters['od_popularnich']) {
            $query->orderBy('reservations_count', 'desc');
        } else {
            $query->orderBy('name', 'asc');
        }

        $equipment = $query
            ->paginate(10)
            ->withQueryString();

        $equipment->getCollection()->transform(function ($item) {
            $item->image_path = $item->image_path ? Storage::url($item->image_path) : null; // Přidání URL obrázku

            return $item;
        });

        return Inertia::render('Admin/Equipment/Index', [
            'equipment' => $equipment,
            'trashedCount' => $trashedCount,
            'categories' => $this->getCategories(),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Equipment/Create', [
            'categories' => $this->getCategories(),
            'defaultRoom' => Auth::user()->default_room,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'manufacturer' => 'required|string',
            'quantity' => 'required|integer|numeric|min:1',
            'image' => 'image|max:10240|nullable|mimes:jpg,jpeg,png,webp',
            'room' => 'required|string',
        ], [
            'name.required' => 'Musíte zadat název vybavení.',
            'name.string' => 'Musí se jednat o text.',
            'description.required' => 'Musíte zadat popis vybavení.',
            'description.string' => 'Musí se jednat o text.',
            'image.image' => 'Musí se jednat o obrázek (jpg, jpeg, png, webp).',
            'image.size' => 'Nahraný obrázek může mít maximálně 10 MB.',
            'image.mimes' => 'Musí se jednat o obrázek (jpg, jpeg, png, webp).',
            'quantity.required' => 'Musíte zadat počet kusů vybavení.',
            'quantity.integer' => 'Musí se jednat o celé číslo.',
            'quantity.numeric' => 'Musí se jednat o celé číslo.',
            'quantity.min' => 'Musíte zadat minimálně 1 kus.',
            'manufacturer.required' => 'Musíte uvést výrobce.',
            'manufacturer.string' => 'Musí se jednat o text.',
            'room.required' => 'Musíte zadat místnost.',
            'room.string' => 'Musí se jednat o text.',
        ]);

        try {
            $equipment = Equipment::create([
                'name' => $request->name,
                'user_id' => Auth::user()->id,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'image_path' => null,
                'manufacturer' => $request->manufacturer,
                'quantity' => $request->quantity,
                'room' => $request->room,
                'slug' => self::createUniqueSlug($request->name, $request->manufacturer),
            ]);

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time().'_'.$file->getClientOriginalName();
                $tempPath = $file->store('temp');
                $fullTempPath = Storage::path($tempPath);

                ProcessEquipmentImage::dispatch($equipment->id, $fullTempPath, $filename, $tempPath);
            }

            return to_route('admin.equipment.index')
                ->with('flash', flash('success', 'Vybavení bylo úspěšně přidáno.'));

        } catch (\Exception $e) {
            return back()->with('flash', flash('error', 'Došlo k chybě při ukládání vybavení.'));
        }
    }

    public function edit($slug)
    {
        $equipment = Equipment::with(['category:id,name'])
            ->withTrashed()
            ->where('slug', $slug)->firstOrFail();

        Gate::authorize('view', $equipment);

        if ($equipment->image_path) {
            $equipment->image_path = Storage::url($equipment->image_path);
        }

        $equipment_reservations = $equipment->reservations()->with(['user:id,username'])->select(['id', 'user_id', 'status', 'start_date', 'end_date'])->get();

        return Inertia::render('Admin/Equipment/Edit', [
            'equipment' => $equipment,
            'reservations' => $equipment_reservations,
            'categories' => $this->getCategories(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $path = null;
        $equipment = Equipment::withTrashed()->findOrFail($id);

        Gate::authorize('update', $equipment);

        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'manufacturer' => 'required|string',
            'quantity' => 'required|integer|numeric|min:1',
            'room' => 'required|string',
            'image' => 'image|max:10240|nullable|mimes:jpg,jpeg,png,webp',
        ], [
            'name.required' => 'Musíte zadat název vybavení.',
            'name.string' => 'Musí se jednat o text.',
            'description.required' => 'Musíte zadat popis vybavení.',
            'description.string' => 'Musí se jednat o text.',
            'manufacturer.required' => 'Musíte uvést výrobce.',
            'manufacturer.string' => 'Musí se jednat o text.',
            'room.required' => 'Musíte zadat místnost.',
            'room.string' => 'Musí se jednat o text.',
            'image.image' => 'Musí se jednat o obrázek (jpg, jpeg, png, webp).',
            'image.size' => 'Nahraný obrázek může mít maximálně 5 MB.',
            'image.mimes' => 'Musí se jednat o obrázek (jpg, jpeg, png, webp).',
        ]);

        // Check for overlapping reservations
        if ($this->hasTooManyOverlappingReservations($equipment, $request->quantity)) {
            return back()->with('flash', flash('error', 'Nelze snížit počet kusů vybavení, protože existují rezervace, které by nebylo možné uspokojit.'));
        }

        if ($request->hasFile('image')) {
            try {
                if ($equipment->image_path) {
                    Storage::disk('public')->delete($equipment->image_path);
                }
                $file = $request->file('image');
                $filename = time().'_'.$file->getClientOriginalName();
                $processedImage = Image::read($file)
                    ->scaleDown(width: 800)
                    ->toWebp();

                $path = 'equipment/'.$filename;
                Storage::disk('public')->put($path, $processedImage);
            } catch (\Exception $e) {
                return back()->with('flash', flash('error', 'Nepodařilo se nahrát obrázek. Zkuste to znovu.'));
            }
        }

        $newSlug = self::createUniqueSlug($request->name, $request->manufacturer);

        $equipment->update([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'manufacturer' => $request->manufacturer,
            'room' => $request->room,
            'quantity' => $request->quantity,
            'image_path' => $path ?? $equipment->image_path,
            'slug' => $newSlug,
        ]);

        return to_route('admin.equipment.edit', $newSlug)->with('flash', flash('success', 'Vybavení bylo úspěšně změněno.'));
    }

    private function hasTooManyOverlappingReservations($equipment, $newQuantity)
    {
        $startDate = Carbon::now();

        $furthestReservation = Reservation::where('equipment_id', $equipment->id)
            ->where('status', '!=', 'archivováno')
            ->orderBy('end_date', 'desc')
            ->first();

        if (! $furthestReservation) {
            return false;
        }

        $endDate = Carbon::parse($furthestReservation->end_date);

        $reservations = Reservation::where('equipment_id', $equipment->id)
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

        for ($date = $startDate->copy(); $date <= $endDate; $date->addDay()) {
            $currentDate = $date->format('Y-m-d');
            $overlappingCount = 0;

            foreach ($reservations as $reservation) {
                if ($reservation->start_date <= $currentDate && $reservation->end_date >= $currentDate) {
                    $overlappingCount++;
                }
            }

            if ($overlappingCount > $newQuantity) {
                return true;
            }
        }

        return false;
    }

    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);
        Gate::authorize('delete', $equipment);

        $equipment->reservations()->where('status', '=', 'neschváleno')->orWhere('status', '=', 'schváleno')->delete();
        $equipment->delete();

        return back()->with('flash', flash('success', 'Vybavení bylo úspěšně odstraněno.'));
    }

    public function restore($id)
    {
        $equipment = Equipment::withTrashed()->findOrFail($id);
        Gate::authorize('restore', $equipment);

        $equipment->restore();

        return back()->with('flash', flash('success', 'Vybavení bylo úspěšně obnoveno.'));
    }

    public function forceDelete($id)
    {
        $equipment = Equipment::withTrashed()->findOrFail($id);
        Gate::authorize('forceDelete', $equipment);

        if ($equipment->image_path) {
            Storage::disk('public')->delete($equipment->image_path);
        }

        if ($equipment->reservations()->where('status', 'probíhá')->count() > 0) {
            return back()->with('flash', flash('error', 'Toto vybavení je právě vypůjčeno a tudíž nelze smazat.'));
        }

        $equipment->reservations()->delete();
        $equipment->forceDelete();

        return to_route('admin.equipment.index')->with('flash', flash('success', 'Vybavení bylo trvale odstraněno.'));
    }
}
