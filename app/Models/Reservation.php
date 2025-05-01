<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Reservation extends Model
{
    use HasFactory;

    protected $table = 'reservations';

    protected $fillable = [
        'equipment_id',
        'user_id',
        'status',
        'comment',
        'user_comment',
        'start_date',
        'end_date',
        'equipment_condition_start',
        'equipment_condition_end',
        'pickup_date',
        'return_date',
        'not_picked_up',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class)->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function admin(): HasOneThrough
    {
        return $this->hasOneThrough(
            User::class,
            Equipment::class,
            'id',
            'id',
            'equipment_id',
            'user_id'
        )->withTrashedParents();
    }
}
