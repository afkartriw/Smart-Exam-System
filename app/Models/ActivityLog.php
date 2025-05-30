<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'lembaga_id', // Tambahkan ini
        'action',
        'description',
        'model_type',
        'model_id',
    ];

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke lembaga (opsional)
    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class);
    }
}