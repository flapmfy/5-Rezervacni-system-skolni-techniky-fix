<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;
    
    protected $table = 'categories';

    protected $fillable = ['name', 'slug', 'user_id', 'user_updated_id'];

    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userUpdated(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_updated_id');
    }
}
