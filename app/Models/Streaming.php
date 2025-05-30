<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Streaming extends Model
{
    use HasFactory;

    protected $fillable = ['sesi_peserta_id', 'stream_url'];

    public function sesiPeserta()
    {
        return $this->belongsTo(SesiPeserta::class);
    }
 
}
