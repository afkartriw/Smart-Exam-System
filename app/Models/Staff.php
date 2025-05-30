<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lembaga_id',
        'nama_staff',
        'email',
        'kewenangan',
        'status',

        'peserta',
        'paket_soal',
        'sesi',
        'pengawas',

        'photo',

    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function lembaga()
    {
        return $this->belongsTo(Lembaga::class, 'lembaga_id');
    }
    public function kewenangans()
{
    return $this->hasMany(Kewenangan::class);
}

}
