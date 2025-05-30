<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaketSoal extends Model
{
    use HasFactory;

    // Menentukan tabel yang digunakan
    protected $table = 'paket_soals';

    protected $fillable = [
        'lembaga_id', 'user_id', 'name', 'materi', 'skala_nilai', 'kkm',
        'acak_soal', 'acak_jawaban', 'petunjuk_pengerjaan'
    ];

    // Relasi One-to-Many: 1 Paket Soal memiliki banyak Soal
    public function soals()
    {
        return $this->hasMany(Soal::class);
    }

    // Relasi ke Lembaga
    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class, 'lembaga_id');
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    public function sesiUjians()
    {
        return $this->hasMany(SesiUjian::class, 'paket_soal_id');
    }

    
}
