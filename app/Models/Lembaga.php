<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lembaga extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nama_lembaga',
        'alamat',
        'kabupaten',
        'jenis',
        'username',
        'email',
        'nama_lengkap',
        'whatsapp',
        'poin',
        'logo'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function staff()
    {
        return $this->hasMany(Staff::class, 'lembaga_id');
    }
    public function peserta()
    {
        return $this->hasMany(Peserta::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    // Relasi ke Sesi Ujian melalui Paket Soal
    public function paketSoal()
    {
        return $this->hasMany(PaketSoal::class);
    }

    // Relasi ke Paket Soal
    public function sesiUjian()
    {
        return $this->hasManyThrough(SesiUjian::class, PaketSoal::class);
    }
}
