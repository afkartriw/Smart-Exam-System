<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poin extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'jumlah_poin',
        'harga',
    ];

    // Relasi ke model Order
    public function orders()
    {
        return $this->hasMany(Order::class, 'poin_id');
    }
}
