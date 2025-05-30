<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'uname',
        'email',
        'number',
        'transaction_id',
        'order_id',
        'gross_amount',
        'payment_type',
        'payment_code',
        'pdf_url',
        'lembaga_id',
        'poin_id', // Tambahkan poin_id ke fillable
    ];

    // Relasi ke model Lembaga
    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class, 'lembaga_id');
    }

    // Relasi ke model Poin
    public function poin()
    {
        return $this->belongsTo(Poin::class, 'poin_id');
    }
}