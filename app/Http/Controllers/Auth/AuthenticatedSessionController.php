<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Traits\LogsActivity;

class AuthenticatedSessionController extends Controller
{
    use LogsActivity;
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();
        
        // Redirect user based on role
        switch ($user->role) {
            case 'admin':
                $this->logActivity('Log in', "Admin dengan ID {$user->id} log in", $user);
                return redirect()->intended('/admin');
            case 'lembaga':
                $this->logActivity('Log in', "Lembaga dengan ID {$user->id} log in", $user);
                return redirect()->intended('/lembaga');
            case 'staff':
                $this->logActivity('Log in', "Staff dengan ID {$user->id} log in", $user);
                return redirect()->intended('/staff');
            case 'peserta':
                $this->logActivity('Log in', "Peserta dengan ID {$user->id} log in", $user);
                return redirect()->intended('/peserta');
            default:
                return redirect()->intended(RouteServiceProvider::HOME);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $this->logActivity('Log out', "User dengan ID {$user->id} log out", $user);

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}