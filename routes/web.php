<?php

use App\Http\Controllers\User;
use App\Http\Middleware\Guest;
use App\Http\Controllers\Admin;
use App\Http\Middleware\Student;
use App\Http\Middleware\Teacher;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Authenticated;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\ProfileController;

// ------------------------------ Nepřihlášení ------------------------------
Route::middleware([Guest::class])->group(function () {
    // Přihlašování
    Route::get('/prihlaseni', [LoginController::class, 'index'])->name('login');
    Route::post('/prihlaseni', [LoginController::class, 'login'])->name('login.post');
});

// ------------------------------ Kdokokliv přihlášený ------------------------------
Route::middleware([Authenticated::class])->group(function () {
    Route::get('/odhlaseni', [LoginController::class, 'logout'])->name('auth.logout');
});

// ------------------------------ Uživatelská část ------------------------------
Route::middleware([Student::class])->group(function () {
    // Domovská obrazovka uživatele
    Route::get('/', [User\ReservationsController::class, 'active'])->name('user.reservations.active');

    // Zobrazení schválených rezervací
    Route::get('/rezervace/schvalene', [User\ReservationsController::class, 'accepted'])->name('user.reservations.accepted');

    // Zobrazení neschválených rezervací
    Route::get('/rezervace/neschvalene', [User\ReservationsController::class, 'waiting'])->name('user.reservations.waiting');

    // Zobrazení archivovaných rezervací
    Route::get('/rezervace/historie', [User\ReservationsController::class, 'archived'])->name('user.reservations.archived');

    // Nabídka vybavení k vypůjčení
    Route::get('/katalog', [User\EquipmentController::class, 'index'])->name('equipment.index');

    // Stránka vybavení
    Route::get('/katalog/{slug}', [User\EquipmentController::class, 'show'])->name('equipment.show');

    // Odstranění rezervace
    Route::delete('/rezervace/{id}', [User\ReservationsController::class, 'delete'])->name('user.reservations.delete');

    // Vytvoření rezervace
    Route::post('/rezervace', [User\ReservationsController::class, 'store'])->name('user.reservations.store');

    // Návod k použití
    Route::inertia('/navod-k-pouziti', 'Student/Manual')->name('user.manual');
});

// ------------------------------ Administrátorská část ------------------------------
Route::middleware([Teacher::class])->group(function () {
    // Domovská obrazovka admina
    Route::get('/admin', [Admin\DashboardController::class, 'index'])->name('admin.dashboard');

    // Kalendář
    Route::get('/admin/kalendar', [Admin\ReservationsController::class, 'calendar'])->name('admin.calendar');

    // Přehled automatických akcí
    Route::get('/admin/akce', [Admin\ActionsController::class, 'index'])->name('admin.actions');

    Route::patch('/admin/akce', [Admin\ActionsController::class, 'update'])->name('admin.actions.update');

    // Profil
    Route::get('/admin/profil', [ProfileController::class, 'index'])->name('admin.profile');
    Route::patch('/admin/profil', [ProfileController::class, 'update'])->name('admin.profile.update');

    // Manuál k použití
    Route::inertia(
        '/admin/navod-k-pouziti',
        'Admin/Manual',
    )->name('admin.manual');

    // ------------------------ Rezervace ------------------------
    // --- Neschválené žádosti --- //
    Route::get('/admin/rezervace/neschvalene', [Admin\ReservationsController::class, 'waiting'])->name('admin.reservations.waiting');

    // Zobrazení žádosti ke schválení
    Route::get('/admin/rezervace/neschvalene/{id}', [Admin\ReservationsController::class, 'showWaiting'])->name('admin.reservations.waiting.show');

    // Schválení zádosti
    Route::patch('/admin/rezervace/neschvalene/', [Admin\ReservationsController::class, 'acceptWaiting'])->name('admin.reservations.waiting.accept');

    // Odstranění zádosti
    Route::delete('/admin/rezervace/neschvalene/', [Admin\ReservationsController::class, 'declineWaiting'])->name('admin.reservations.waiting.decline');

    // Schválené rezervace
    Route::get('/admin/rezervace/schvalene', [Admin\ReservationsController::class, 'accepted'])->name('admin.reservations.accepted');

    // Zobrazení schválené žádosti
    Route::get('/admin/rezervace/schvalene/{id}', [Admin\ReservationsController::class, 'showAccepted'])->name('admin.reservations.accepted.show');

    // Zahájení rezervace
    Route::patch('/admin/rezervace/schvalene/', [Admin\ReservationsController::class, 'acceptAccepted'])->name('admin.reservations.accepted.accept');

    // Odstranění schválené rezervace
    Route::delete('/admin/rezervace/schvalene/', [Admin\ReservationsController::class, 'declineAccepted'])->name('admin.reservations.accepted.decline');

    // Probíhají rezervace
    Route::get('/admin/rezervace/probihajici', [Admin\ReservationsController::class, 'active'])->name('admin.reservations.active');

    // Zobrazení probíhající rezervace k ukončení
    Route::get('/admin/rezervace/probihajici/{id}', [Admin\ReservationsController::class, 'showActive'])->name('admin.reservations.active.show');

    // Ukončení rezervace
    Route::patch('/admin/rezervace/probihajici/', [Admin\ReservationsController::class, 'endActive'])->name('admin.reservations.active.end');

    // Archivované rezervace
    Route::get('/admin/rezervace/historie', [Admin\ReservationsController::class, 'archived'])->name('admin.reservations.archived');

    // Zobrazení archivované rezervace
    Route::get('/admin/rezervace/historie/{id}', [Admin\ReservationsController::class, 'showArchived'])->name('admin.reservations.archived.show');

    // ------------------------ Vybavení ------------------------
    // Výpis vybavení
    Route::get('/admin/vybaveni', [Admin\EquipmentController::class, 'index'])->name('admin.equipment.index');

    // Formulář k vytvoření
    Route::get('/admin/vybaveni/pridat', [Admin\EquipmentController::class, 'create'])->name('admin.equipment.create');

    // Vytvoření vybavení
    Route::post('/admin/vybaveni/pridat', [Admin\EquipmentController::class, 'store'])->name('admin.equipment.store');

    // Změna vybavení
    Route::get('/admin/vybaveni/upravit/{slug}', [Admin\EquipmentController::class, 'edit'])->name('admin.equipment.edit');

    // Uložení změny
    Route::post('/admin/vybaveni/upravit/{id}', [Admin\EquipmentController::class, 'update'])->name('admin.equipment.update');

    // Smazání vybavení
    Route::delete('/admin/vybaveni/{id}', [Admin\EquipmentController::class, 'destroy'])->name('admin.equipment.delete');

    // Obnovení vybavení
    Route::patch('/admin/vybaveni/{id}', [Admin\EquipmentController::class, 'restore'])->name('admin.equipment.restore');

    // Trvalé smazání
    Route::delete('/admin/vybaveni/trvale-odstranit/{id}', [Admin\EquipmentController::class, 'forceDelete'])->name('admin.equipment.forceDelete');

    // ------------------------ Kategorie ------------------------
    // Zobrazení kategorií
    Route::get('/admin/kategorie', [Admin\CategoriesController::class, 'index'])->name('admin.categories.index');

    // Přidání kategorie
    Route::post('/admin/kategorie/pridat', [Admin\CategoriesController::class, 'create'])->name('admin.categories.create');

    // Změna kategorie
    Route::get('/admin/kategorie/upravit/{id}', [Admin\CategoriesController::class, 'edit'])->name('admin.categories.edit');

    // Uložení změny
    Route::patch('/admin/kategorie/upravit/{id}', [Admin\CategoriesController::class, 'update'])->name('admin.categories.update');

    // Smazání kategorie
    Route::delete('/admin/kategorie/{id}', [Admin\CategoriesController::class, 'destroy'])->name('admin.categories.delete');
});
