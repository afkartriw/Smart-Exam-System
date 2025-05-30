<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class SesiUjian extends Model
{
    use HasFactory;

    protected $table = 'sesi_ujians';

    protected $fillable = [
        'nama_sesi_ujian',
        'paket_soal_id',
        'mode_peserta',
        'kelas_kelompok',
        'tanggal_pelaksanaan',
        'waktu_mulai',
        'waktu_pengerjaan',
        'wajib_kamera',
        'batasi_browser',
        'tampilkan_hasil',
        'tampilkan_pembahasan',
        'gunakan_sertifikat',
        'petunjuk_pengerjaan',
    ];

    public static function getYesNoOptions()
    {
        return [
            'ya' => 'Ya',
            'tidak' => 'Tidak',
        ];
    }
    public function paketSoal()
    {
        return $this->belongsTo(PaketSoal::class, 'paket_soal_id');
    }
     // Relasi ke tabel sesi_pesertas
     public function sesiPesertas()
     {
         return $this->hasMany(SesiPeserta::class, 'sesi_id');
     }
 
     // Relasi ke tabel pesertas melalui tabel sesi_pesertas
    //  public function peserta()
    //  {
    //      return $this->belongsToMany(Peserta::class, 'sesi_pesertas', 'sesi_id', 'peserta_id')->withPivot('status');
    //  }

     // app/Models/SesiUjian.php
    // app/Models/SesiUjian.php
    public function peserta()
    {
        return $this->belongsToMany(Peserta::class, 'sesi_pesertas', 'sesi_id', 'peserta_id')
                    ->withPivot(['status', 'started_at', 'finished_at'])
                    ->withTimestamps();
    }

}

