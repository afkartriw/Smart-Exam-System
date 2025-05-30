<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanPeserta extends Model
{
    use HasFactory;

    protected $fillable = [
        'sesi_ujian_id',
        'soal_id',
        'user_id',
        'jawaban_id',
        'jawaban_teks',
        'poin',
    ];
}
