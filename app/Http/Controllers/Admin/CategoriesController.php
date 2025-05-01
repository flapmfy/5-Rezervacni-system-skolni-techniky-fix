<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['vyhledavani', 'jeVlastnik']);

        $query = Category::query()
            ->select(['id', 'name', 'created_at', 'updated_at'])
            ->withCount(['equipment' => function ($query) {
                $query->withTrashed();
            }]);

        if (! empty($filters['vyhledavani'])) {
            $search = $filters['vyhledavani'];
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
            );
        }

        if (! empty($filters['jeVlastnik'])) {
            $query->where('user_id', Auth::user()->id);
        }

        $categories = $query
            ->orderBy('name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'categoryName' => 'required|string|unique:App\Models\Category,name',
        ],
            [
                'categoryName.required' => 'Musíte zadat název kategorie.',
                'categoryName.string' => 'Musí se jednat o text.',
                'categoryName.unique' => 'Tato kategorie již existuje.',
            ]);

        $categoryName = $request->categoryName;
        $categorySlug = Str::slug($categoryName, '-');

        Category::create([
            'user_id' => Auth::user()->id,
            'name' => $categoryName,
            'slug' => $categorySlug,
        ]);

        return back()->with('flash', flash('success', 'Kategorie byla úspěšně vytvořena'));
    }

    public function edit($id)
    {
        $category = Category::select(['id', 'user_id', 'user_updated_id', 'created_at', 'updated_at', 'name'])->findOrFail($id);
        $equipmentCount = $category->equipment()->withTrashed()->count();
        $userEquipment = Auth::user()->equipment()->where('category_id', $id)->withTrashed()->get();
        $user_updated = $category->userUpdated;

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'equipmentCount' => $equipmentCount,
            'userEquipment' => $userEquipment,
            'createdBy' => $category->user->first_name.' '.$category->user->last_name,
            'createdAt' => $category->created_at,
            'updatedBy' => $user_updated ? $user_updated->first_name.' '.$user_updated->last_name : null,
            'updatedAt' => $user_updated ? $category->updated_at : null,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'categoryName' => 'required|string|unique:App\Models\Category,name',
        ],
            [
                'categoryName.required' => 'Musíte zadat název kategorie.',
                'categoryName.string' => 'Musí se jednat o text.',
                'categoryName.unique' => 'Tato kategorie již existuje.',
            ]);

        $categoryName = $request->categoryName;
        $categorySlug = Str::slug($categoryName, '-');

        $category = Category::findOrFail($id);
        $category->update([
            'name' => $categoryName,
            'slug' => $categorySlug,
            'user_updated_id' => Auth::user()->id,
        ]);

        return back()->with('flash', flash('success', 'Kategorie byla úspěšně změněna'));
    }

    public function destroy($id)
    {
        $categoryEquipmentCount = Category::findOrFail($id)->equipment()->withTrashed()->count();

        if ($categoryEquipmentCount > 0) {
            return back()->with('flash', flash('error', 'Tato kategorie nemůže být smazána, jelikož je stále používána. Zkontrolujte seznam smazaného vybavení vybavení.'));
        }

        Category::findOrFail($id)->delete();

        return to_route('admin.categories.index')->with('flash', flash('success', 'Kategorie byla odstraněna'));
    }
}
