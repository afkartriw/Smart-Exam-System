<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login'); // Redirect ke login jika belum login
        }

        $user = Auth::user();

        // Jika role tidak sesuai, redirect ke halaman dashboard masing-masing
        if (!in_array($user->role, $roles)) {
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

        return $next($request);
    }
}
