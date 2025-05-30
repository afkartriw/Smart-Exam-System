<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if ($guard === 'google') {
                    return redirect('/dashboard'); // Ganti '/home' dengan rute yang sesuai untuk autentikasi dengan Google
                }
                return redirect('/'); // Ganti '/dashboard' dengan rute yang sesuai untuk autentikasi biasa
            }
        }

        return $next($request);
    }
}
