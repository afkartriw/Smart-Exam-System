<?php

namespace App\Http\Controllers;

use App\Models\SesiUjian;
use App\Models\PaketSoal;
use App\Models\SesiPeserta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Peserta;
use Illuminate\Support\Facades\Auth;

class PengawasUjianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load('lembaga');

        if (!$user->lembaga) {
            return redirect()->back()->with('error', 'Lembaga tidak ditemukan untuk user ini.');
        }

        $sesiUjian = SesiUjian::whereHas('paketSoal', function ($query) use ($user) {
            $query->where('lembaga_id', $user->lembaga->id);
        })->with('paketSoal')->get();

        return Inertia::render('Role/Lembaga/Pengawas', [
            'pengawas' => $sesiUjian
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): Response
    {
        $streaming = SesiUjian::with(['paketSoal', 'sesiPesertas.streaming'])->findOrFail($id);
    
        return Inertia::render('Role/Lembaga/Pengawas/Streaming', [
            'streaming' => $streaming
        ]);
    }
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
