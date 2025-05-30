<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SesiPeserta extends Model
{
    use HasFactory;

    protected $fillable = ['sesi_id', 'peserta_id', 'status'];

  // Relasi ke tabel sesi_ujians
  public function sesi()
  {
      return $this->belongsTo(SesiUjian::class, 'sesi_id');
  }

  // Relasi ke tabel (peserta)
  public function peserta()
  {
      return $this->belongsTo(Peserta::class, 'peserta_id');
  }
  public function streaming()
  {
      return $this->hasOne(Streaming::class);
  }
  
}
