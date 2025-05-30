<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kewenangan extends Model
{
    use HasFactory;

    protected $fillable = [
        'staff_id',
        'value',
        'status',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

}
