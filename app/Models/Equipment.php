<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Equipment extends Model
{
    use SoftDeletes, HasFactory;

    protected $table = 'equipment';

    protected $fillable = ['category_id', 'user_id', 'image_path', 'manufacturer', 'name', 'description', 'room', 'quantity', 'slug'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
