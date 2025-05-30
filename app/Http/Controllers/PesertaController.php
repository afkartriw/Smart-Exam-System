<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Peserta;
use App\Models\SesiUjian;
use App\Models\PaketSoal;
use App\Models\Soal;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Imports\PesertaImport; // Untuk proses impor peserta
use Maatwebsite\Excel\Facades\Excel; // Untuk fitur import Excel
use App\Traits\LogsActivity;
use Illuminate\Support\Facades\Redirect;

class PesertaController extends Controller
{
    use LogsActivity;
    /**
     * Menampilkan daftar peserta.
     */
    public function index()
    {
        $lembaga = \App\Models\Lembaga::where('user_id', Auth::id())->first();

        if (!$lembaga) {
            return abort(403, 'Lembaga tidak ditemukan');
        }

        $peserta = \App\Models\Peserta::where('lembaga_id', $lembaga->id)->get();

        return Inertia::render('Role/Lembaga/Peserta', [
            'pesertas' => $peserta
        ]);

    }

    /**
     * Menampilkan form tambah peserta.
     */
    public function create()
    {
        return Inertia::render('Role/Lembaga/Peserta/Tambah');
    }

    /**
     * Menyimpan data peserta baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_peserta' => 'required|string|max:255',
            'email' => 'required|email|unique:pesertas,email',
            'no_peserta' => 'required|string|unique:pesertas,no_peserta',
            'kelompok' => 'required|string|max:50',
        ]);

        // Simpan peserta
        $peserta = Peserta::create([
            'user_id' => Auth::id(),
            'lembaga_id' => Auth::user()->lembaga_id,
            'nama_peserta' => $request->nama_peserta,
            'email' => $request->email,
            'no_peserta' => $request->no_peserta,
            'kelompok' => $request->kelompok,
        ]);

        // Pastikan ID peserta sudah ada sebelum mencatat log aktivitas
        $this->logActivity('Tambah', "Data peserta dengan ID {$peserta->id} ditambah", $peserta);

        return Redirect::route('peserta.index')->with('success', 'Peserta berhasil ditambahkan.');
    }


    /**
     * Menampilkan detail peserta.
     */
    public function show($id)
    {
        $peserta = Peserta::findOrFail($id);
        return Inertia::render('Role/Lembaga/Peserta/Show', compact('peserta'));
    }
    

    /**
     * Menampilkan form edit peserta.
     */
    public function edit($id)
    {
        $peserta = Peserta::findOrFail($id);
        return Inertia::render('Role/Lembaga/Peserta/Edit', compact('peserta'));
    }

    /**
     * Mengupdate data peserta.
     */
    public function update(Request $request, $id)
    {
        $peserta = Peserta::findOrFail($id);

        $request->validate([
            'nama_peserta' => 'required|string|max:255',
            'email' => 'required|email|unique:pesertas,email,' . $peserta->id,
            'no_peserta' => 'required|string|unique:pesertas,no_peserta,' . $peserta->id,
            'kelompok' => 'required|string|max:50',
        ]);

        $peserta->update([
            'nama_peserta' => $request->nama_peserta,
            'email' => $request->email,
            'no_peserta' => $request->no_peserta,
            'kelompok' => $request->kelompok,
        ]);

        $this->logActivity('Edit', "Data peserta dengan ID {$id} diedit", $peserta);

        return Redirect::route('peserta.index')->with('success', 'Peserta berhasil diperbarui.');
    }

    /**
     * Menghapus peserta.
     */
    public function destroy($id)
    {
        $peserta = Peserta::findOrFail($id);
        $peserta->user()->delete(); 
        $peserta->delete();

        $this->logActivity('Hapus', "Data peserta dengan ID {$id} dihapus", $peserta);

        return Redirect::route('peserta.index')->with('success', 'Peserta berhasil dihapus.');
    }

    public function destroyAll()
    {
        // Hapus semua peserta satu per satu agar event delete tetap terpanggil
        Peserta::all()->each(function ($peserta) {
            $peserta->user()->delete(); // Hapus user terkait jika ada
            $peserta->delete(); // Hapus peserta
        });

        $this->logActivity('Hapus', "Data peserta dihapus semua", $peserta);

    
        return Redirect::route('peserta.index')->with('success', 'Semua peserta dan relasi terkait berhasil dihapus.');
    }
    
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx|max:300', 
        ]);

        Excel::import(new PesertaImport, $request->file('file'));

        return Redirect::route('peserta.index')->with('success', 'Semua peserta dan relasi terkait berhasil dihapus.');
    }










    
        /**
         * Menampilkan daftar peserta.
         */
        public function index_staff()
        {
            // Ambil data staff berdasarkan user yang sedang login
            $staff = \App\Models\Staff::where('user_id', Auth::id())->first();

            if (!$staff) {
                return abort(403, 'Staff tidak ditemukan');
            }

            // Ambil peserta berdasarkan lembaga_id yang dimiliki oleh staff
            $peserta = \App\Models\Peserta::where('lembaga_id', $staff->lembaga_id)->get();

            return Inertia::render('Role/Staff/Peserta', [
                'pesertas' => $peserta
            ]);
        }
    
        /**
         * Menampilkan form tambah peserta.
         */
        public function create_staff()
        {
            return Inertia::render('Role/Staff/Peserta/Tambah');
        }
    
        /**
         * Menyimpan data peserta baru.
         */
        public function store_staff(Request $request)
        {
            $request->validate([
                'nama_peserta' => 'required|string|max:255',
                'email' => 'required|email|unique:pesertas,email',
                'no_peserta' => 'required|string|unique:pesertas,no_peserta',
                'kelompok' => 'required|string|max:50',
            ]);
    
            Peserta::create([
                'user_id' => Auth::id(),
                'lembaga_id' => Auth::user()->lembaga_id,
                'nama_peserta' => $request->nama_peserta,
                'email' => $request->email,
                'no_peserta' => $request->no_peserta,
                'kelompok' => $request->kelompok,
            ]);

            $this->logActivity('Tambah', "Data peserta dengan ID {$id} ditambah", $peserta);
    
            return Redirect::route('peserta.index_staff')->with('success', 'Peserta berhasil ditambahkan.');
        }
    
        /**
         * Menampilkan detail peserta.
         */
        public function show_staff($id)
        {
            $peserta = Peserta::findOrFail($id);
            return Inertia::render('Role/Staff/Peserta/Show', compact('peserta'));
        }
    
        /**
         * Menampilkan form edit peserta.
         */
        public function edit_staff($id)
        {
            $peserta = Peserta::findOrFail($id);
            return Inertia::render('Role/Staff/Peserta/Edit', compact('peserta'));
        }
    
        /**
         * Mengupdate data peserta.
         */
        public function update_staff(Request $request, $id)
        {
            $peserta = Peserta::findOrFail($id);
    
            $request->validate([
                'nama_peserta' => 'required|string|max:255',
                'email' => 'required|email|unique:pesertas,email,' . $peserta->id,
                'no_peserta' => 'required|string|unique:pesertas,no_peserta,' . $peserta->id,
                'kelompok' => 'required|string|max:50',
            ]);
    
            $peserta->update([
                'nama_peserta' => $request->nama_peserta,
                'email' => $request->email,
                'no_peserta' => $request->no_peserta,
                'kelompok' => $request->kelompok,
            ]);

            $this->logActivity('Edit', "Data peserta dengan ID {$id} diedit", $peserta);
    
            return Redirect::route('peserta.index_staff')->with('success', 'Peserta berhasil diperbarui.');
        }
    
        /**
         * Menghapus peserta.
         */
        public function destroy_staff($id)
        {
            $peserta = Peserta::findOrFail($id);
            $peserta->user()->delete(); 
            $peserta->delete();

            $this->logActivity('Hapus', "Data peserta dengan ID {$id} dihapus", $peserta);
    
            return Redirect::route('peserta.index_staff')->with('success', 'Peserta berhasil dihapus.');
        }
    
        public function destroyAll_staff()
        {
            // Hapus semua peserta satu per satu agar event delete tetap terpanggil
            Peserta::all()->each(function ($peserta) {
                $peserta->user()->delete(); // Hapus user terkait jika ada
                $peserta->delete(); // Hapus peserta
            });

            $this->logActivity('Hapus', "Data peserta dihapus semua", $peserta);
        
            return Redirect::route('peserta.index_staff')->with('success', 'Semua peserta dan relasi terkait berhasil dihapus.');
        }
        
        public function import_staff(Request $request)
        {
            $request->validate([
                'file' => 'required|mimes:xlsx|max:300', 
            ]);
    
            Excel::import(new PesertaImport, $request->file('file'));

            $this->logActivity('Tambah', "Data peserta ditambah dengan cara import", $peserta);
    
            return Redirect::route('peserta.index_staff')->with('success', 'Semua peserta dan relasi terkait berhasil dihapus.');
        }









            public function index_sesi()
            {
                $user = auth()->user();
                $peserta = $user->peserta; // ambil relasi peserta

                $sesiUjians = SesiUjian::with('paketSoal')
                    ->where('lembaga_id', $peserta->lembaga_id)
                    ->where(function ($query) use ($peserta) {
                        $query->where('kelas_kelompok', '-')
                            ->orWhere('kelas_kelompok', $peserta->kelompok);
                    })
                    ->get();

                return Inertia::render('Role/Peserta/Peserta', [
                    'sesiUjians' => $sesiUjians,
                    'peserta' => $peserta, // ini yang penting!
                ]);

            }
        
            public function showDetailSesi(SesiUjian $sesiUjian)
            {
                $peserta = Peserta::where('user_id', Auth::id())->firstOrFail();
            
                $sesi = SesiUjian::where('id', $sesiUjian->id)
                    ->where(function ($query) use ($peserta) {
                        $query->where('kelas_kelompok', '-')
                              ->orWhere('kelas_kelompok', $peserta->kelompok);
                    })
                    ->firstOrFail();
            
                $pesertaSesi = $sesiUjian->peserta()
                    ->where('peserta_id', $peserta->id)
                    ->where('status', 'aktif')
                    ->firstOrFail();
            
                if ($sesiUjian->waktu_mulai > now()) {
                    return redirect()->route('peserta.dashboard')->with('error', 'Sesi ujian belum dimulai');
                }
            
                $remainingTime = $sesiUjian->waktu_pengerjaan * 60;
                if ($pesertaSesi->pivot->started_at) {
                    $elapsedTime = now()->diffInSeconds($pesertaSesi->pivot->started_at);
                    $remainingTime = max(0, $remainingTime - $elapsedTime);
                }
            
                $sesiUjian->load(['paketSoal' => function ($query) {
                    $query->withCount('soals');
                }]);
            
                // Ambil soal pertama
                $soalAwal = \App\Models\Soal::where('paket_soal_id', $sesiUjian->paket_soal_id)
                    ->orderBy('id')
                    ->first();
            
                return inertia('Role/Peserta/Detail', [
                    'sesiUjian' => array_merge($sesiUjian->toArray(), [
                        'remaining_time' => $remainingTime,
                        'soal_awal_id' => $soalAwal?->id,
                    ]),
                ]);
            }
            


            
           
    

            public function showSoal(SesiUjian $sesi, PaketSoal $paketSoal, Soal $soal)
            {
                abort_unless($sesi->paket_soal_id === $paketSoal->id, 403);
                abort_unless($soal->paket_soal_id === $paketSoal->id, 403);

                $soals = Soal::with(['jawabans', 'jawabanPeserta' => function ($q) use ($sesi) {
                    $q->where('sesi_ujian_id', $sesi->id);
                }])->where('paket_soal_id', $paketSoal->id)->get();

                return Inertia::render('Role/Peserta/Ujian', [
                    'sesiUjianId' => $sesi->id,
                    'paketSoal' => $paketSoal,
                    'soals' => $soals,
                    'currentSoal' => $soal, // Changed from 'soal' to 'currentSoal' for clarity
                    'auth' => [
                        'user' => auth()->user(),
                    ],
                ]);
            }
            



}
