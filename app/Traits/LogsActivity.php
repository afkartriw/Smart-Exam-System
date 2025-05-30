<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    public static function logActivity($action, $description = null, $model = null)
    {
        $user = Auth::user();
        $lembagaId = null;

        // Tentukan lembaga_id berdasarkan role user
        if ($user->role === 'lembaga') {
            // Jika role adalah lembaga, ambil lembaga_id dari tabel lembaga
            $lembagaId = $user->lembaga->id;
        } elseif ($user->role === 'staff') {
            // Jika role adalah staff, ambil lembaga_id dari tabel staff
            $lembagaId = $user->staff->lembaga_id;
        } elseif ($user->role === 'peserta') {
            // Jika role adalah peserta, ambil lembaga_id dari tabel staff
            $lembagaId = $user->peserta->lembaga_id;
        } elseif ($user->role === 'admin') {
            // Jika role adalah admin, set lembaga_id sebagai null atau 'admin'
            $lembagaId = null; // atau 'admin' jika ingin menyimpan string
        }

        // Simpan log activity
        ActivityLog::create([
            'user_id' => $user->id,
            'lembaga_id' => $lembagaId, // Tambahkan lembaga_id
            'action' => $action,
            'description' => $description,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model ? $model->id : null,
        ]);
    }
}