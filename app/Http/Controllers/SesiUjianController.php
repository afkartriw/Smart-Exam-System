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

class SesiUjianController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('lembaga');

        if (!$user->lembaga) {
            return redirect()->back()->with('error', 'Lembaga tidak ditemukan untuk user ini.');
        }

        $sesiUjian = SesiUjian::whereHas('paketSoal', function ($query) use ($user) {
            $query->where('lembaga_id', $user->lembaga->id);
        })->with('paketSoal')->get();

        return Inertia::render('Role/Lembaga/Sesi', [
            'sesi_ujians' => $sesiUjian
        ]);
    }

    public function create(): Response
    {
        $authUser = Auth::user()->load('lembaga');
        if (!$authUser->lembaga) {
            return redirect()->back()->with('error', 'Lembaga tidak ditemukan untuk user ini.');
        }

        $paketSoals = PaketSoal::select('id', 'name')->get();
        $kelompokPeserta = Peserta::where('lembaga_id', $authUser->lembaga->id)
            ->whereNotNull('kelompok')
            ->distinct()
            ->pluck('kelompok')
            ->map(fn($kelompok) => [
                'value' => $kelompok,
                'label' => ucfirst($kelompok)
            ])
            ->values();

        $opsiYaTidak = [
            ['value' => 'ya', 'label' => 'Ya'],
            ['value' => 'tidak', 'label' => 'Tidak']
        ];

        $pesertaManual = Peserta::where('lembaga_id', $authUser->lembaga->id)
            ->select('id', 'nama_peserta', 'email')
            ->get();

        return Inertia::render('Role/Lembaga/Sesi/Tambah', [
            'paketSoals' => $paketSoals,
            'kelompokPesertas' => $kelompokPeserta,
            'opsiYaTidak' => $opsiYaTidak,
            'pesertaManual' => $pesertaManual
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_sesi_ujian' => 'required|string|max:255',
            'paket_soal_id' => 'required|exists:paket_soals,id',
            'mode_peserta' => 'required|in:Semua,Kelompok Peserta,Manual',
            'kelas_kelompok' => 'nullable|string|max:255',
            'tanggal_pelaksanaan' => 'required|date',
            'waktu_mulai' => 'required',
            'waktu_pengerjaan' => 'required|integer',
            'wajib_kamera' => 'required|in:ya,tidak',
            'batasi_browser' => 'required|in:ya,tidak',
            'tampilkan_hasil' => 'required|in:ya,tidak',
            'tampilkan_pembahasan' => 'required|in:ya,tidak',
            'gunakan_sertifikat' => 'required|in:ya,tidak',
            'petunjuk_pengerjaan' => 'nullable|string',
            'peserta_manual' => 'nullable|array',
            'peserta_manual.*' => 'exists:pesertas,id',
        ]);

        $authUser = Auth::user()->load('lembaga');
        if (!$authUser->lembaga) {
            return redirect()->back()->with('error', 'Lembaga tidak ditemukan untuk user ini.');
        }

        $sesiUjian = SesiUjian::create($request->all());

        if ($request->mode_peserta === 'Semua') {
            $pesertas = Peserta::where('lembaga_id', $authUser->lembaga->id)->pluck('id');
        } elseif ($request->mode_peserta === 'Kelompok Peserta') {
            $pesertas = Peserta::where('lembaga_id', $authUser->lembaga->id)
                ->where('kelompok', $request->kelas_kelompok)
                ->pluck('id');
        } elseif ($request->mode_peserta === 'Manual') {
            $pesertas = collect($request->peserta_manual);
        } else {
            $pesertas = collect();
        }

        foreach ($pesertas as $pesertaId) {
            SesiPeserta::create([
                'sesi_id' => $sesiUjian->id,
                'peserta_id' => $pesertaId,
                'status' => 'aktif'
            ]);
        }

        return redirect()->route('sesi_ujian.index')->with('success', 'Sesi ujian berhasil ditambahkan.');
    }


    public function edit(SesiUjian $sesiUjian): Response
    {
        $paketSoals = PaketSoal::select('id', 'name')->get();
        $authUser = Auth::user();

        $kelompokPeserta = Peserta::where('lembaga_id', $authUser->lembaga_id)
            ->whereNotNull('kelompok')
            ->distinct()
            ->pluck('kelompok')
            ->map(fn($kelompok) => [
                'value' => $kelompok,
                'label' => ucfirst($kelompok)
            ])
            ->values();

        return Inertia::render('Role/Lembaga/Sesi/Edit', [
            'sesiUjian' => $sesiUjian->load('sesiPesertas.peserta'),
            'paketSoals' => $paketSoals,
            'kelompokPesertas' => $kelompokPeserta
        ]);
    }

    public function show($id): Response
{
    $sesiUjian = SesiUjian::with(['paketSoal', 'sesiPesertas.peserta'])->findOrFail($id);

    return Inertia::render('Role/Lembaga/Sesi/Detail', [
        'sesi_ujian' => $sesiUjian
    ]);
}

public function update(Request $request, SesiUjian $sesiUjian)
{
    $request->validate([
        'nama_sesi_ujian' => 'required|string|max:255',
        'paket_soal_id' => 'required|exists:paket_soals,id',
        'mode_peserta' => 'required|in:Semua,Kelompok Peserta,Manual',
        'kelas_kelompok' => 'nullable|string|max:255',
        'tanggal_pelaksanaan' => 'required|date',
        'waktu_mulai' => 'required',
        'waktu_pengerjaan' => 'required|integer',
        'wajib_kamera' => 'required|in:ya,tidak',
        'batasi_browser' => 'required|in:ya,tidak',
        'tampilkan_hasil' => 'required|in:ya,tidak',
        'tampilkan_pembahasan' => 'required|in:ya,tidak',
        'gunakan_sertifikat' => 'required|in:ya,tidak',
        'petunjuk_pengerjaan' => 'nullable|string',
        'peserta_manual' => 'nullable|array',
        'peserta_manual.*' => 'exists:pesertas,id',
    ]);

    $sesiUjian->update($request->all());

    // Update peserta
    $authUser = Auth::user()->load('lembaga');
    if (!$authUser->lembaga) {
        return redirect()->back()->with('error', 'Lembaga tidak ditemukan untuk user ini.');
    }

    if ($request->mode_peserta === 'Semua') {
        $pesertas = Peserta::where('lembaga_id', $authUser->lembaga->id)->pluck('id');
    } elseif ($request->mode_peserta === 'Kelompok Peserta') {
        $pesertas = Peserta::where('lembaga_id', $authUser->lembaga->id)
            ->where('kelompok', $request->kelas_kelompok)
            ->pluck('id');
    } elseif ($request->mode_peserta === 'Manual') {
        $pesertas = collect($request->peserta_manual);
    } else {
        $pesertas = collect();
    }

    // Hapus peserta lama
    SesiPeserta::where('sesi_id', $sesiUjian->id)->delete();

    // Tambah peserta baru
    foreach ($pesertas as $pesertaId) {
        SesiPeserta::create([
            'sesi_id' => $sesiUjian->id,
            'peserta_id' => $pesertaId,
            'status' => 'aktif'
        ]);
    }

    return redirect()->route('sesi_ujian.index')->with('success', 'Sesi ujian berhasil diperbarui.');
}

    public function destroy(SesiUjian $sesiUjian)
    {
        $sesiUjian->delete();
        return redirect()->route('sesi_ujian.index')->with('success', 'Sesi ujian berhasil dihapus.');
    }

    public function setPesertaStatus(Request $request, $id)
    {
        $peserta = SesiPeserta::where('peserta_id', $id)->first();

        if (!$peserta) {
            return back()->withErrors(['message' => 'Peserta tidak ditemukan']);
        }

        // Toggle status
        $peserta->status = $peserta->status === 'aktif' ? 'non_aktif' : 'aktif';
        $peserta->save();

        return back()->with('success', 'Status peserta berhasil diperbarui');
    }

}
