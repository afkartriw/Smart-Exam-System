<?php
namespace App\Imports;

use App\Models\Peserta;
use App\Models\User;
use App\Models\Lembaga;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PesertaImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        $user = Auth::user();
        $lembaga = Lembaga::where('user_id', $user->id)->first();
        if (!$lembaga) {
            return null;
        }

        $lastPeserta = Peserta::latest('id')->first();
        $noPesertaBaru = $lastPeserta ? str_pad($lastPeserta->id + 1, 8, '0', STR_PAD_LEFT) : '00000001';

        $password = Str::random(8);

        $userPeserta = User::create([
            'name' => $row['nama_peserta'],
            'email' => $row['email'],
            'password' => Hash::make($password),
            'role' => 'peserta',
        ]);

        $peserta = Peserta::create([
            'user_id' => $userPeserta->id,
            'lembaga_id' => $lembaga->id,
            'nama_peserta' => $row['nama_peserta'],
            'email' => $row['email'],
            'no_peserta' => $noPesertaBaru,
            'kelompok' => $row['kelompok'],
        ]);

        Mail::raw("Akun peserta Anda telah dibuat.\nEmail: {$row['email']}\nPassword: {$password}", function ($message) use ($row) {
            $message->to($row['email'])->subject('Akun Peserta Anda');
        });

        return $peserta;
    }
}
