<?php

namespace App\Http\Controllers;

use App\Models\Lembaga;
use App\Models\PaketSoal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Traits\LogsActivity;

class PaketSoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   
     public function index()
     {
         $user = Auth::user();
     
         // Pastikan user terautentikasi dan memiliki peran "lembaga"
         if (!$user || $user->role !== 'lembaga') {
             return redirect()->route('paket.index')->with('error', 'Unauthorized');
         }
     
         // Ambil semua Paket Soal berdasarkan `lembaga_id` yang terkait dengan user
         $paketsoal = PaketSoal::with('user') // Include relasi agar lebih efisien
             ->where('lembaga_id', $user->lembaga->id ?? null)
             ->get();
     
         return Inertia::render('Role/Lembaga/PaketSoal', [
             'paketsoals' => $paketsoal
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
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'materi' => 'required|string|max:255',
            'skala_nilai' => 'required|integer',
            'kkm' => 'required|integer',
            'acak_soal' => 'sometimes|boolean',
            'acak_jawaban' => 'sometimes|boolean',
            'petunjuk_pengerjaan' => 'required|string',
            'soal_ids' => 'nullable|array'
        ]);
    
        $userId = auth()->id();
        // Ambil lembaga_id dari user yang login
        $lembagaId = auth()->user()->lembaga?->id;
        if (!$lembagaId) {
            return response()->json(['message' => 'Lembaga tidak ditemukan!'], 403);
        }
    
        // Tambahkan `lembaga_id` ke dalam data sebelum menyimpan
        $validated['lembaga_id'] = $lembagaId;
        $validated['user_id'] = $userId;
        $validated['acak_soal'] = $validated['acak_soal'] ?? false;
        $validated['acak_jawaban'] = $validated['acak_jawaban'] ?? false;
    
        // Simpan paket soal
        $paketSoal = PaketSoal::create($validated);
    
        // Hubungkan dengan soal jika ada
        if (!empty($request->soal_ids)) {
            $paketSoal->soals()->sync($request->soal_ids);
        }
    
        $this->logActivity('Tambah', "Data paket soal dengan ID {$paketSoal->id} ditambah", $paketSoal);

        return redirect()->route('paket.index')->with('success', 'paket_soal added successfully');
        
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
        $user = Auth::user();
    
        // Pastikan user adalah pemilik paket soal
        $paketSoal = PaketSoal::where('id', $id)
            ->where('lembaga_id', $user->lembaga->id ?? null)
            ->with('soals')
            ->first();
    
        if (!$paketSoal) {
            return redirect()->route('paket.index')->with('error', 'Paket soal tidak ditemukan.');
        }
    
        return Inertia::render('Role/Lembaga/PaketSoal/Edit', [
            'paketSoal' => $paketSoal
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
    
        // Pastikan user hanya bisa mengedit paket soal miliknya
        $paketSoal = PaketSoal::where('id', $id)
            ->where('lembaga_id', $user->lembaga->id ?? null)
            ->first();
    
        if (!$paketSoal) {
            return redirect()->route('paket.index')->with('error', 'Paket soal tidak ditemukan.');
        }
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'materi' => 'required|string|max:255',
            'skala_nilai' => 'required|integer',
            'kkm' => 'required|integer',
            'acak_soal' => 'sometimes|boolean',
            'acak_jawaban' => 'sometimes|boolean',
            'petunjuk_pengerjaan' => 'required|string',
            'soal_ids' => 'nullable|array'
        ]);
    
        $validated['acak_soal'] = $validated['acak_soal'] ?? false;
        $validated['acak_jawaban'] = $validated['acak_jawaban'] ?? false;
    
        // Update paket soal
        $paketSoal->update($validated);
    
        // Sinkronisasi relasi dengan soal jika ada
        if (!empty($request->soal_ids)) {
            $paketSoal->soals()->sync($request->soal_ids);
        }

        $this->logActivity('Edit', "Data paket soal dengan ID {$paketSoal->id} diedit", $paketSoal);

        return redirect()->route('paket.index')->with('success', 'Paket soal berhasil diperbarui.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
    
        // Pastikan user hanya bisa menghapus paket soal miliknya
        $paketSoal = PaketSoal::where('id', $id)
            ->where('lembaga_id', $user->lembaga->id ?? null)
            ->first();
    
        if (!$paketSoal) {
            return redirect()->route('paket.index')->with('error', 'Paket soal tidak ditemukan.');
        }
    
        // Hapus semua soal yang terkait dengan paket soal ini
        $paketSoal->soals()->delete();
    
        // Hapus paket soal
        $paketSoal->delete();

        $this->logActivity('Hapus', "Data paket soal dengan ID {$paketSoal->id} dihapus", $paketSoal);
    
        return redirect()->route('paket.index')->with('success', 'Paket soal berhasil dihapus.');
    }
}
