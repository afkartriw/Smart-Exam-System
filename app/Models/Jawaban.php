<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jawaban extends Model
{
    use HasFactory;

    protected $fillable = ['soal_id', 'jawaban', 'tipe', 'benar', 'nilai'];
    protected $casts = [
        'benar' => 'boolean', // Laravel akan otomatis mengonversi 1/0 menjadi true/false
    ];

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }
}
