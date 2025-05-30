<?php

namespace App\Http\Controllers;

use App\Models\Soal;
use App\Models\PaketSoal;
use App\Models\Jawaban;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;


class SoalController extends Controller
{
    /**
     * Tampilkan daftar soal.
     */
    public function index()
    {
        $soals = Soal::with('paketSoal')->latest()->paginate(10);

        return Inertia::render('Soal/Index', [
            'soals' => $soals
        ]);
    }

    /**
     * Tampilkan form untuk membuat soal baru.
     */
    public function create()
    {
        $paketSoals = PaketSoal::all(); // Ambil daftar paket soal
        return Inertia::render('Soal/Create', [
            'paketSoals' => $paketSoals
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'paket_soal_id' => 'required|exists:paket_soals,id',
            'pertanyaan' => 'required|string',
            'tipe' => 'required|in:pilihan_ganda,true_false,drag_and_drop,pencocokan,audio,video,gambar,isian,esai',
            'metode_koreksi' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if (in_array($request->tipe, ['isian', 'esai']) && !in_array($value, ['exact', 'fuzzy', 'ai'])) {
                        $fail("Metode koreksi hanya diperbolehkan untuk soal isian dan esai.");
                    }
                }
            ],
            'media' => 'nullable|file|mimes:jpg,jpeg,png,mp3,mp4',
            'jawaban' => 'required|array',
            'jawaban.*.jawaban' => 'required|string',
            'jawaban.*.benar' => 'required|boolean',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Upload media jika ada
        $mediaPath = $request->hasFile('media') ? $request->file('media')->store('soal_media', 'public') : null;
    
        // Simpan soal baru
        $soal = Soal::create([
            'paket_soal_id' => $request->paket_soal_id,
            'pertanyaan' => $request->pertanyaan,
            'tipe' => $request->tipe,
            'metode_koreksi' => in_array($request->tipe, ['isian', 'esai']) ? $request->metode_koreksi : null,
            'media' => $mediaPath,
        ]);
    
        // Simpan jawaban
        foreach ($request->jawaban as $jawaban) {
            Jawaban::create([
                'soal_id' => $soal->id,
                'jawaban' => $jawaban['jawaban'],
                'benar' => $jawaban['benar'],
            ]);
        }
    
    
        return redirect()->route('soal.show', ['id' => $request->paket_soal_id]);
    }

    /**
     * Fungsi untuk memperbarui nilai setiap soal dalam paket soal agar total tetap 100.
     */




    /**
     * Tampilkan detail soal.
     */

    
     public function show($paketSoalId)
     {
         $soal = Soal::where('paket_soal_id', $paketSoalId)
                     ->with(['paketSoal', 'jawabans'])
                     ->get()
                     ->map(function ($item) {
                         $item->media_url = $item->media ? asset(Storage::url($item->media)) : null;
                         return $item;
                     });
     
         return Inertia::render('Role/Lembaga/PaketSoal/Show', [
             'soal' => $soal
         ]);
     }
     

    /**
     * Tampilkan form untuk mengedit soal.
     */
    public function edit(PaketSoal $paketSoal, Soal $soal)
    {
        $soal->load(['paketSoal', 'jawabans']);
    
        $soal->media_url = $soal->media ? asset(Storage::url($soal->media)) : null;
    
        return Inertia::render('Role/Lembaga/PaketSoal/EditSoal', [
            'soal' => $soal,
            'paketSoal' => $paketSoal
        ]);
    }
    

    /**
     * Update soal di database.
     */
    public function update(Request $request, $paketSoalId, $soalId)
    {
        $soal = Soal::where('id', $soalId)->where('paket_soal_id', $paketSoalId)->first();
    
        if (!$soal) {
            return back()->with('error', 'Soal tidak ditemukan atau tidak terkait dengan paket soal ini.');
        }
    
        $request->validate([
            'paket_soal_id' => 'required|exists:paket_soals,id',
            'pertanyaan' => 'required|string',
            'tipe' => 'required|in:pilihan_ganda,true_false,isian,esai',
            'metode_koreksi' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    if (in_array($request->tipe, ['isian', 'esai']) && !in_array($value, ['exact', 'fuzzy', 'ai'])) {
                        $fail("Metode koreksi hanya diperbolehkan untuk soal isian dan esai.");
                    }
                }
            ],
            'media' => 'nullable|file|mimes:jpg,jpeg,png,mp3,mp4|max:20480',
            'jawaban' => 'required|array',
            'jawaban.*.id' => 'nullable|exists:jawabans,id',
            'jawaban.*.jawaban' => 'required|string',
            'jawaban.*.benar' => 'required|boolean',
        ]);
    
        // Hapus media lama jika ada file baru
        if ($request->hasFile('media')) {
            if ($soal->media) {
                Storage::disk('public')->delete($soal->media);
            }
            $mediaPath = $request->file('media')->store('soal_media', 'public');
        } else {
            $mediaPath = $soal->media;
        }
    
        // Update data soal
        $soal->update([
            'paket_soal_id' => $request->paket_soal_id,
            'pertanyaan' => $request->pertanyaan,
            'tipe' => $request->tipe,
            'metode_koreksi' => in_array($request->tipe, ['isian', 'esai']) ? $request->metode_koreksi : null,
            'media' => $mediaPath,
        ]);
    
        // Update jawaban
        $existingJawabanIds = $soal->jawabans()->pluck('id')->toArray();
        $updatedJawabanIds = [];
    
        foreach ($request->jawaban as $jawaban) {
            if (isset($jawaban['id']) && in_array($jawaban['id'], $existingJawabanIds)) {
                // Update jawaban yang sudah ada
                $soal->jawabans()->where('id', $jawaban['id'])->update([
                    'jawaban' => $jawaban['jawaban'],
                    'benar' => filter_var($jawaban['benar'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0,
                ]);
                $updatedJawabanIds[] = $jawaban['id'];
            } else {
                // Tambah jawaban baru
                $newJawaban = Jawaban::create([
                    'soal_id' => $soal->id,
                    'jawaban' => $jawaban['jawaban'],
                    'benar' => filter_var($jawaban['benar'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0,
                ]);
                $updatedJawabanIds[] = $newJawaban->id;
            }
        }
    
        // Hapus jawaban yang tidak ada di request
        $soal->jawabans()->whereNotIn('id', $updatedJawabanIds)->delete();
    
        return redirect()->route('soal.show', ['id' => $request->paket_soal_id]);
    }


    
    /**
     * Hapus soal dari database.
     */
    public function destroy($paketSoalId, $soalId)
   {
    // Cari soal berdasarkan ID dan pastikan terkait dengan paket soal yang benar
    $soal = Soal::where('id', $soalId)->where('paket_soal_id', $paketSoalId)->first();

    if (!$soal) {
        return back()->with('error', 'Soal tidak ditemukan atau tidak terkait dengan paket soal ini.');
    }

    // Hapus media jika ada
    if ($soal->media) {
        Storage::disk('public')->delete($soal->media);
    }

    // Hapus jawaban yang terkait
    $soal->jawabans()->delete();

    // Hapus soal
    $soal->delete();

    return back()->with('success', 'Soal berhasil dihapus.');
}

    
}
