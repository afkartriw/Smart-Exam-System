<?php

namespace App\Http\Middleware;

use Closure;
use Inertia\Inertia;
use App\Models\About;

class ShareAboutData
{
    public function handle($request, Closure $next)
    {
        // Ambil data About
        $abouts = About::all()->map(function ($about) {
            return [
                'id' => $about->id,
                'nama' => $about->nama,
                'slogan' => $about->slogan,
                'subSlogan' => $about->subSlogan,
                'deskripsi' => $about->deskripsi,
                'alamat' => $about->alamat,
                'phone' => $about->phone,
                'email' => $about->email,
                'linkYT' => $about->linkYT,
                'linkDrive' => $about->linkDrive,
                'logo1' => $about->logo1 ? asset('storage/' . $about->logo1) : null,
                'logo2' => $about->logo2 ? asset('storage/' . $about->logo2) : null,
            ];
        });

        // Bagikan data ke semua halaman
        Inertia::share('abouts', $abouts);

        return $next($request);
    }
}