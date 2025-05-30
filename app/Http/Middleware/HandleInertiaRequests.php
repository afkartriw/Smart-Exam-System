<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Lembaga;
use App\Models\Staff;
use App\Models\Peserta;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        $lembaga = null;
        $staff = null;
        $peserta = null;

        if ($user) {
            if ($user->role === 'lembaga') {
                // Ambil data lembaga berdasarkan user_id
                $lembaga = Lembaga::where('user_id', $user->id)->first();
            } elseif ($user->role === 'staff') {
                // Ambil staff berdasarkan user_id
                $staff = Staff::where('user_id', $user->id)->first();

                // Jika staff ditemukan, ambil data lembaga berdasarkan lembaga_id
                if ($staff) {
                    $lembaga = Lembaga::find($staff->lembaga_id);
                }
            } elseif ($user->role === 'peserta') {
                // Ambil data peserta berdasarkan user_id
                $peserta = Peserta::where('user_id', $user->id)->first();
                if ($peserta) {
                    $lembaga = Lembaga::find($peserta->lembaga_id);
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'nama_lengkap' => $user->name,
                    'lembaga' => $lembaga ? [
                        'id' => $lembaga->id,
                        'nama_lembaga' => $lembaga->nama_lembaga,
                        'nama_lengkap' => $lembaga->nama_lengkap,
                        'alamat' => $lembaga->alamat,
                        'kabupaten' => $lembaga->kabupaten,
                        'jenis' => $lembaga->jenis,
                        'logo' => $lembaga->logo,
                    ] : null,
                    'staff' => $staff ? [
                        'id' => $staff->id,
                        'nama_staff' => $staff->nama_staff,
                        'kewenangan' => $staff->kewenangan,
                        'status' => $staff->status,
                        'photo' => $staff->photo,
                        'peserta' => $staff->peserta, 
                        'paket_soal' => $staff->paket_soal, 
                        'sesi' => $staff->sesi, 
                        'pengawas' => $staff->pengawas, 
                    ] : null,
                    'peserta' => $peserta ? [
                        'id' => $peserta->id,
                        'nama_peserta' => $peserta->nama_peserta,
                        'email' => $peserta->email,
                        'no_peserta' => $peserta->no_peserta,
                        'kelompok' => $peserta->kelompok,
                        'lembaga_id' => $peserta->lembaga_id,
                    ] : null,
                ] : null,
            ],
        ];
    }
}
