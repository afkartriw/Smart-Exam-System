<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'login',
                'description' => 'User logged in',
            ]);
        }

        return $next($request);
    }
}