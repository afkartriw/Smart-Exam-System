<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleController extends Controller
{
    public function googlepage()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Cek apakah pengguna sudah terdaftar berdasarkan google_id atau email
            $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();
    
            if ($user) {
                // Jika akun ditemukan tapi belum memiliki google_id, tambahkan google_id
                if (!$user->google_id) {
                    $user->google_id = $googleUser->id;
                    $user->save();
                }
    
                // Login user
                Auth::login($user);
                Log::info('User berhasil login:', ['user' => Auth::user()]);
    
                // Redirect berdasarkan role
                return $this->redirectBasedOnRole($user);
            } else {
                Log::error('User tidak ditemukan: ', ['email' => $googleUser->email]);
                return redirect()->route('login')->with('error', 'Akun Google Anda belum terdaftar. Silakan hubungi lembaga Anda.');
            }
        } catch (\Throwable $e) {
            Log::error('Error login Google:', ['message' => $e->getMessage()]);
            return redirect()->route('login')->with('error', 'Terjadi kesalahan saat login melalui Google.');
        }
    }

    private function redirectBasedOnRole($user)
    {
        switch ($user->role) {
            case 'admin':
                return redirect()->intended('/admin');
            case 'lembaga':
                return redirect()->intended('/lembaga');
            case 'staff':
                return redirect()->intended('/staff');
            case 'peserta':
                return redirect()->intended('/peserta');
            default:
                return redirect('/');
        }
    }
}
