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

class UjianPesertaController extends Controller
{
    public function index(Request $request): Response
{
      // Ambil user yang sedang login beserta relasi peserta dan sesi ujian dengan PaketSoal
      $user = $request->user()->load(['pesertas.sesiUjians' => function ($query) {
        $query->with('paketSoal');
    }]);

    // Pastikan user memiliki role 'peserta' dan memiliki relasi peserta
    if ($user->role === 'peserta' && $user->pesertas->isNotEmpty()) {
        $lembaga_id = $user->pesertas->first()->lembaga_id;

        // Ambil semua peserta ujian berdasarkan lembaga_id
        $pesertaujian = Peserta::where('lembaga_id', $lembaga_id)->get();

        // Ambil semua sesi ujian yang memiliki peserta dengan user yang sedang login
        $sesiUjians = $user->pesertas->flatMap->sesiUjians->unique('id')->values();
    } else {
        // Jika bukan peserta atau tidak memiliki data peserta, kosongkan
        $pesertaujian = [];
        $sesiUjians = [];
    }

    // Debugging untuk memastikan data yang diambil benar
    ([
        'user' => $user,
        'lembaga_id' => $lembaga_id ?? null,
        'pesertaujian' => $pesertaujian,
        'sesiUjians' => $sesiUjians
    ]);

    return Inertia::render('Role/Peserta/Peserta', [
        'pesertaujian' => $pesertaujian,
        'sesiUjianspeserta' => $sesiUjians
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
    public function show(string $id)
    {
        //
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
