<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\AccountApproved;

class UserController extends Controller
{
    public function index(Request $request)
{
    $filters = $request->only(['vyhledavani', 'zobrazit_zabanovane']);
    $query = User::whereNotNull('approved_at')->latest();

    // By default, don't show banned users unless explicitly requested
    if (!empty($filters['zobrazit_zabanovane'])) {
        $query->where('is_banned', true);
    } else {
        $query->where('is_banned', false);
    }

    if (!empty($filters['vyhledavani'])) {
        $query->where(function ($query) use ($filters) {
            $query->where('username', 'like', '%'.$filters['vyhledavani'].'%')
                ->orWhere('email', 'like', '%'.$filters['vyhledavani'].'%')
                ->orWhere('first_name', 'like', '%'.$filters['vyhledavani'].'%')
                ->orWhere('last_name', 'like', '%'.$filters['vyhledavani'].'%');
        });
    }

    $users = $query->paginate(20)->withQueryString()->through(function ($user) {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'role' => $user->role,
            'class' => $user->default_room,
            'created_at' => $user->created_at,
            'is_banned' => $user->is_banned,
            'banned_at' => $user->banned_at,
            'ban_reason' => $user->ban_reason,
        ];
    });

    // Count of banned users for the toggle display
    $bannedCount = User::whereNotNull('approved_at')
        ->where('is_banned', true)
        ->count();

    return Inertia::render('Admin/Users/Index', [
        'users' => $users,
        'filters' => $filters,
        'bannedCount' => $bannedCount,
    ]);
}


   public function show($id)
{
    $user = User::findOrFail($id);
    
    // Get reservations with necessary data
    $reservations = $user->reservations()
        ->select([
            'id', 
            'equipment_id', 
            'start_date', 
            'end_date', 
            'status', 
            'created_at',
            'equipment_condition_start',
            'equipment_condition_end',
            'pickup_date',
            'return_date',
            'comment',
            'user_comment'
        ])
        ->with(['equipment' => function ($query) {
            $query->select('id', 'name', 'user_id', 'image_path', 'slug')
                ->with(['owner' => function ($q) {
                    $q->select('id', 'first_name', 'last_name');
                }]);
        }])
        ->get()
        ->map(function ($reservation) {
            return [
                ...$reservation->toArray(),
                'issues' => checkReservationIssues($reservation),
            ];
        });
    
    // Group reservations by status
    $groupedReservations = $reservations->groupBy('status');
    
    // Prepare counts for different reservation statuses
    $counts = [
        'waiting' => $groupedReservations->get('neschváleno', collect())->count(),
        'approved' => $groupedReservations->get('schváleno', collect())->count(),
        'active' => $groupedReservations->get('probíhá', collect())->count(),
        'archived' => $groupedReservations->get('archivováno', collect())->count(),
        'total' => $reservations->count(),
    ];
    
    return Inertia::render('Admin/Users/Show', [
        'user' => [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'role' => $user->role,
            'class' => $user->default_room,
            'created_at' => $user->created_at,
            'is_banned' => $user->is_banned,
            'banned_at' => $user->banned_at,
            'ban_reason' => $user->ban_reason,
        ],
        'reservations' => [
            'waiting' => $groupedReservations->get('neschváleno', collect())->values(),
            'approved' => $groupedReservations->get('schváleno', collect())->values(),
            'active' => $groupedReservations->get('probíhá', collect())->values(),
            'archived' => $groupedReservations->get('archivováno', collect())->values(),
        ],
        'counts' => $counts,
        'currentAdminId' => Auth::id(),
    ]);
}


    public function usersPending(Request $request)
    {
        $filters = $request->only(['vyhledavani']);
        $query = User::whereNull('approved_at')
            ->whereNotNull('email_verified_at')
            ->latest();

        if (! empty($filters['vyhledavani'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('username', 'like', '%'.$filters['vyhledavani'].'%')
                    ->orWhere('email', 'like', '%'.$filters['vyhledavani'].'%')
                    ->orWhere('first_name', 'like', '%'.$filters['vyhledavani'].'%')
                    ->orWhere('last_name', 'like', '%'.$filters['vyhledavani'].'%');
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

        $user->notify(new AccountApproved);

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

    public function ban(Request $request, $id)
{
    $user = User::findOrFail($id);
    
    // Prevent banning admin users
    if ($user->role === 'admin') {
        return back()->with('flash', flash('error', 'Administrátora nelze zabanovat.'));
    }

    // Validate ban reason
    $request->validate([
        'ban_reason' => 'required|string|max:255',
    ], [
        'ban_reason.required' => 'Důvod banování je povinný.',
        'ban_reason.string' => 'Důvod banování musí být text.',
        'ban_reason.max' => 'Důvod banování může mít maximálně 255 znaků.',
    ]);

    // Begin transaction to ensure all operations succeed or fail together
    DB::beginTransaction();
    
    try {
        // Delete waiting and accepted reservations
        $user->reservations()
            ->whereIn('status', ['neschváleno', 'schváleno'])
            ->delete();
            
        // Set user as banned
        $user->is_banned = true;
        $user->ban_reason = $request->ban_reason;
        $user->banned_at = now();
        $user->save();
        
        DB::commit();
        return back()->with('flash', flash('success', 'Uživatel byl úspěšně zabanován a jeho neschválené a schválené rezervace byly odstraněny.'));
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->with('flash', flash('error', 'Nastala chyba při banování uživatele: ' . $e->getMessage()));
    }
}


    public function unban($id)
    {
        $user = User::findOrFail($id);

        if (!$user->is_banned) {
            return back()->with('flash', flash('error', 'Tento uživatel není zabanován.'));
        }

        $user->is_banned = false;
        $user->ban_reason = null;
        $user->banned_at = null;
        $user->save();

        return back()->with('flash', flash('success', 'Uživatel byl úspěšně odbanován.'));
    }
}
