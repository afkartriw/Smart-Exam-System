<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Lembaga;
use App\Models\Staff;
use App\Models\Peserta;
use App\Models\Keunggulan;
use App\Models\Fitur;
use App\Models\Testimoni;
use App\Models\Order;
use App\Models\About;
use App\Models\Poin;
use App\Models\SesiUjian;
use App\Models\PaketSoal;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Traits\LogsActivity;


class AdminController extends Controller
{
    use LogsActivity;


    public function dashboard()
    {
        // Hitung jumlah data keseluruhan
        $totalLembaga = Lembaga::count();
        $totalStaff = Staff::count();
        $totalPeserta = Peserta::count();
        $totalSesiUjian = SesiUjian::count();
        $totalPaketSoal = PaketSoal::count();
        
        // Hitung total poin terjual dengan lebih efisien
        $totalPoinTerjual = Order::where('status', 'settlement')
                ->with('poin') // Eager load relasi poin
                ->get()
                ->sum(function ($order) {
                    return $order->poin->jumlah_poin; // Ambil jumlah_poin dari relasi poin
                });

        // Hitung total transaksi (order) dengan status 'settlement'
        $totalTransaksi = Order::where('status', 'settlement')->sum('gross_amount');

        // Ambil data log activity
        $logs = ActivityLog::with(['user', 'lembaga'])->latest()->get();

        $formattedLogs = $logs->map(function ($log) {
            return [
                'id' => $log->id,
                'lembaga' => $log->lembaga ? $log->lembaga->nama_lembaga : 'Admin', // Pastikan ini ada
                'date' => $log->created_at->format('F d, Y'), // Format tanggal
                'time' => $log->created_at->format('H.i'), // Format waktu
                'action' => $log->action, // Aksi (Tambah, Edit, Hapus)
                'description' => $log->description, // Deskripsi aktivitas
            ];
        });

        return Inertia::render('Role/Admin/Dashboard', [
            'totalLembaga' => $totalLembaga,
            'totalStaff' => $totalStaff,
            'totalPeserta' => $totalPeserta,
            'totalSesiUjian' => $totalSesiUjian,
            'totalPaketSoal' => $totalPaketSoal,
            'totalPoinTerjual' => $totalPoinTerjual,
            'totalTransaksi' => $totalTransaksi,
            'logs' => $formattedLogs,
        ]);
    }




    // CRUDD ORDERRRRRRRRRRRRR
    // CRUDD ORDERRRRRRRRRRRRR
    // CRUDD ORDERRRRRRRRRRRRR

    public function index_order()
    {
        // Gunakan eager loading untuk memuat relasi 'lembaga' dan 'poin'
        $orders = Order::with(['lembaga', 'poin'])->get();
        
        return Inertia::render('Role/Admin/Pembayaran', ['orders' => $orders]);
    }

    public function show_order($id)
    {
        // Gunakan eager loading untuk memuat relasi 'lembaga' dan 'poin'
        $order = Order::with(['lembaga', 'poin'])->findOrFail($id);
        return Inertia::render('Role/Admin/Pembayaran/Detail', ['order' => $order]);
    }

    // CRUDD ABOUTUSSSSSSSSSSSSSSSSSS
    // CRUDD ABOUTUSSSSSSSSSSSSSSSSSS
    // CRUDD ABOUTUSSSSSSSSSSSSSSSSSS

    public function index_about()
    {
        $abouts = About::all();
        return Inertia::render('Role/Admin/Aboutus', ['abouts' => $abouts]);
    }

    public function update_about(Request $request, About $about)
    {
        $request->validate([
            'nama' => 'nullable|string',
            'logo1' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'logo2' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'slogan' => 'nullable|string',
            'subSlogan' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'alamat' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'linkYT' => 'nullable|string',
            'linkDrive' => 'nullable|string',
        ]);
    
        // Simpan gambar lama jika tidak ada perubahan
        $logo1Path = $about->logo1;
        $logo2Path = $about->logo2;
    
        // Upload logo1 jika ada file baru
        if ($request->hasFile('logo1')) {
            if ($about->logo1) {
                \Storage::delete('public/' . $about->logo1);
            }
            $file = $request->file('logo1');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $logo1Path = $file->storeAs('aboutus', $filename, 'public');
        }
    
        // Upload logo2 jika ada file baru
        if ($request->hasFile('logo2')) {
            if ($about->logo2) {
                \Storage::delete('public/' . $about->logo2);
            }
            $file = $request->file('logo2');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $logo2Path = $file->storeAs('aboutus', $filename, 'public');
        }
    
        // Update database
        $about->update([
            'nama' => $request->nama ?? $about->nama, // Gunakan nilai lama jika kosong
            'slogan' => $request->slogan ?? $about->slogan,
            'subSlogan' => $request->subSlogan ?? $about->subSlogan,
            'deskripsi' => $request->deskripsi ?? $about->deskripsi,
            'alamat' => $request->alamat ?? $about->alamat,
            'phone' => $request->phone ?? $about->phone,
            'email' => $request->email ?? $about->email,
            'linkYT' => $request->linkYT ?? $about->linkYT,
            'linkDrive' => $request->linkDrive ?? $about->linkDrive,
            'logo1' => $logo1Path,
            'logo2' => $logo2Path,
        ]);

        $this->logActivity('Edit', "Data about dengan ID {$about->id} ditambah", $about);
        
    
        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }


    //  CRUDD  KEUNGGULANNNNN
    //  CRUDD  KEUNGGULANNNNN
    //  CRUDD  KEUNGGULANNNNN
    //  CRUDD  KEUNGGULANNNNN

    public function index_keunggulan()
    {
        return Inertia::render('Role/Admin/Keunggulan', [
            'keunggulans' => Keunggulan::all()->map(function ($keunggulan) {
                return [
                    'id' => $keunggulan->id,
                    'nama_keunggulan' => $keunggulan->nama_keunggulan,
                    'deskripsi' => $keunggulan->deskripsi,
                    'gambar' => $keunggulan->gambar ? asset('storage/' . $keunggulan->gambar) : null,
                ];
            }),
        ]);
    }

    public function show_keunggulan($id)
    {
        $keunggulan = Keunggulan::findOrFail($id);
        return Inertia::render('Role/Admin/Keunggulan/Detail', [
            'keunggulan' => [
                'id' => $keunggulan->id,
                'nama_keunggulan' => $keunggulan->nama_keunggulan,
                'deskripsi' => $keunggulan->deskripsi,
                'gambar' => $keunggulan->gambar ? asset('storage/' . $keunggulan->gambar) : null,
            ],
        ]);
    }

    public function create_keunggulan()
    {
        return Inertia::render('Role/Admin/Keunggulan/Tambah');
    }

    public function store_keunggulan(Request $request)
    {
        $request->validate([
            'nama_keunggulan' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('keunggulans', $filename, 'public');
        }

        $keunggulan = Keunggulan::create([
            'nama_keunggulan' => $request->input('nama_keunggulan'),
            'deskripsi' => $request->input('deskripsi'),
            'gambar' => $imagePath,
        ]);

        $this->logActivity('Tambah', "Data keunggulan dengan ID {$keunggulan->id} ditambah", $keunggulan);

        return redirect()->route('keunggulan.index_keunggulan')->with('success', 'Keunggulan berhasil ditambahkan.');
    }

    public function edit_keunggulan($id)
    {
        $keunggulan = Keunggulan::findOrFail($id);

        return Inertia::render('Role/Admin/Keunggulan/Edit', [
            'keunggulan' => [
                'id' => $keunggulan->id,
                'nama_keunggulan' => $keunggulan->nama_keunggulan,
                'deskripsi' => $keunggulan->deskripsi,
                'gambar' => $keunggulan->gambar ? asset('storage/' . $keunggulan->gambar) : null,
            ],
        ]);
    }

    public function update_keunggulan(Request $request, $id)
    {
        $keunggulan = Keunggulan::findOrFail($id);

        $request->validate([
            'nama_keunggulan' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if (!empty($keunggulan->gambar)) {
                Storage::delete('public/' . $keunggulan->gambar);
            }
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $keunggulan->gambar = $file->storeAs('keunggulans', $filename, 'public');
        }

        $keunggulan->update([
            'nama_keunggulan' => $request->input('nama_keunggulan'),
            'deskripsi' => $request->input('deskripsi'),
            'gambar' => $keunggulan->gambar,
        ]);

        $this->logActivity('Edit', "Data keunggulan dengan ID {$keunggulan->id} diedit", $keunggulan);

        return redirect()->route('keunggulan.index_keunggulan')->with('success', 'Keunggulan berhasil diperbarui.');
    }

    public function destroy_keunggulan($id)
    {
        $keunggulan = Keunggulan::findOrFail($id);

        if (!empty($keunggulan->gambar)) {
            Storage::delete('public/' . $keunggulan->gambar);
        }

        $keunggulan->delete();

        $this->logActivity('Hapus', "Data keunggulan dengan ID {$keunggulan->id} dihapus", $keunggulan);

        return redirect()->route('keunggulan.index_keunggulan')->with('success', 'Keunggulan berhasil dihapus.');
    }
    


    //  CRUDD  FITURRRR
    //  CRUDD  FITURRRR
    //  CRUDD  FITURRRR
    //  CRUDD  FITURRRR



    public function index_fitur()
    {
        return Inertia::render('Role/Admin/Fitur', [
            'fiturs' => Fitur::all()->map(function ($fitur) {
                return [
                    'id' => $fitur->id,
                    'nama_fitur' => $fitur->nama_fitur,
                    'deskripsi' => $fitur->deskripsi,
                    'gambar' => $fitur->gambar ? asset('storage/' . $fitur->gambar) : null,
                ];
            }),
        ]);
    }

    public function show_fitur($id)
    {
        $fitur = Fitur::findOrFail($id);
        return Inertia::render('Role/Admin/Fitur/Detail', [
            'fitur' => [
                'id' => $fitur->id,
                'nama_fitur' => $fitur->nama_fitur,
                'deskripsi' => $fitur->deskripsi,
                'gambar' => $fitur->gambar ? asset('storage/' . $fitur->gambar) : null,
            ],
        ]);
    }

    public function create_fitur()
    {
        return Inertia::render('Role/Admin/Fitur/Tambah');
    }

    public function store_fitur(Request $request)
    {
        $request->validate([
            'nama_fitur' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('fiturs', $filename, 'public');
        }

        $fitur = Fitur::create([
            'nama_fitur' => $request->nama_fitur,
            'deskripsi' => $request->deskripsi,
            'gambar' => $imagePath,
        ]);

        $this->logActivity('Tambah', "Data fitur dengan ID {$fitur->id} ditambah", $fitur);

        return redirect()->route('fitur.index_fitur')->with('success', 'Fitur berhasil ditambahkan.');
    }

    public function edit_fitur($id)
    {
        $fitur = Fitur::findOrFail($id);

        return Inertia::render('Role/Admin/Fitur/Edit', [
            'fitur' => [
                'id' => $fitur->id,
                'nama_fitur' => $fitur->nama_fitur,
                'deskripsi' => $fitur->deskripsi,
                'gambar' => $fitur->gambar ? asset('storage/' . $fitur->gambar) : null,
            ],
        ]);
    }

    public function update_fitur(Request $request, $id)
    {
        $fitur = Fitur::findOrFail($id);

        $request->validate([
            'nama_fitur' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = $fitur->gambar;

        if ($request->hasFile('gambar')) {
            if ($fitur->gambar) {
                Storage::delete('public/' . $fitur->gambar);
            }
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('fiturs', $filename, 'public');
        }

        $fitur->update([
            'nama_fitur' => $request->nama_fitur,
            'deskripsi' => $request->deskripsi,
            'gambar' => $imagePath,
        ]);

        $this->logActivity('Edit', "Data fitur dengan ID {$fitur->id} diedit", $fitur);


        return redirect()->route('fitur.index_fitur')->with('success', 'Fitur berhasil diperbarui.');
    }

    public function destroy_fitur($id)
    {
        $fitur = Fitur::findOrFail($id);

        if ($fitur->gambar) {
            Storage::delete('public/' . $fitur->gambar);
        }

        $fitur->delete();

        $this->logActivity('Hapus', "Data fitur dengan ID {$fitur->id} dihapus", $fitur);


        return redirect()->route('fitur.index_fitur')->with('success', 'Fitur berhasil dihapus.');
    }


    //  CRUDD  TESTOMONIIIIIII
    //  CRUDD  TESTOMONIIIIIII
    //  CRUDD  TESTOMONIIIIIII
    //  CRUDD  TESTOMONIIIIIII


    public function index_testimoni()
    {
        return Inertia::render('Role/Admin/Testimoni', [
            'testimonis' => Testimoni::all()->map(function ($testimoni) {
                return [
                    'id' => $testimoni->id,
                    'nama' => $testimoni->nama,
                    'jabatan' => $testimoni->jabatan,
                    'isi' => $testimoni->isi,
                    'foto' => $testimoni->foto ? asset('storage/' . $testimoni->foto) : null,
                ];
            }),
        ]);
    }

    public function show_testimoni($id)
    {
        $testimoni = Testimoni::findOrFail($id);
        return Inertia::render('Role/Admin/Testimoni/Detail', [
            'testimoni' => [
                'id' => $testimoni->id,
                'nama' => $testimoni->nama,
                'jabatan' => $testimoni->jabatan,
                'isi' => $testimoni->isi,
                'foto' => $testimoni->foto ? asset('storage/' . $testimoni->foto) : null,
            ],
        ]);
    }

    public function create_testimoni()
    {
        return Inertia::render('Role/Admin/Testimoni/Tambah');
    }

    public function store_testimoni(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'isi' => 'required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('testimonis', $filename, 'public');
        }

        $testimoni = Testimoni::create([
            'nama' => $request->nama,
            'jabatan' => $request->jabatan,
            'isi' => $request->isi,
            'foto' => $imagePath,
        ]);

        $this->logActivity('Tambah', "Data testimoni dengan ID {$testimoni->id} ditambah", $testimoni);


        return redirect()->route('testimoni.index_testimoni')->with('success', 'Testimoni berhasil ditambahkan.');
    }

    public function edit_testimoni($id)
    {
        $testimoni = Testimoni::findOrFail($id);

        return Inertia::render('Role/Admin/Testimoni/Edit', [
            'testimoni' => [
                'id' => $testimoni->id,
                'nama' => $testimoni->nama,
                'jabatan' => $testimoni->jabatan,
                'isi' => $testimoni->isi,
                'foto' => $testimoni->foto ? asset('storage/' . $testimoni->foto) : null,
            ],
        ]);
    }

    public function update_testimoni(Request $request, $id)
    {
        $testimoni = Testimoni::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'isi' => 'required|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $imagePath = $testimoni->foto;
        if ($request->hasFile('foto')) {
            if ($testimoni->foto) {
                Storage::delete('public/' . $testimoni->foto);
            }
            $file = $request->file('foto');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('testimonis', $filename, 'public');
        }

        $testimoni->update([
            'nama' => $request->nama,
            'jabatan' => $request->jabatan,
            'isi' => $request->isi,
            'foto' => $imagePath,
        ]);

        $this->logActivity('Edit', "Data testimoni dengan ID {$testimoni->id} diedit", $testimoni);

        return redirect()->route('testimoni.index_testimoni')->with('success', 'Testimoni berhasil diperbarui.');
    }

    public function destroy_testimoni($id)
    {
        $testimoni = Testimoni::findOrFail($id);

        if ($testimoni->foto) {
            Storage::delete('public/' . $testimoni->foto);
        }

        $testimoni->delete();

        $this->logActivity('Hapus', "Data testimoni dengan ID {$testimoni->id} dihapus", $testimoni);

        return redirect()->route('testimoni.index_testimoni')->with('success', 'Testimoni berhasil dihapus.');
    }



    //  CRUDD  POINNNNN
    //  CRUDD  POINNNNN
    //  CRUDD  POINNNNN
    //  CRUDD  POINNNNN


    public function index_poin()
    {
        return Inertia::render('Role/Admin/Poin', [
            'poins' => Poin::all()->map(function ($poin) {
                return [
                    'id' => $poin->id,
                    'nama' => $poin->nama,
                    'jumlah_poin' => $poin->jumlah_poin,
                    'harga' => $poin->harga,
                ];
            }),
        ]);
    }

    public function show_poin($id)
    {
        $poin = Poin::findOrFail($id);
        return Inertia::render('Role/Admin/Poin/Detail', [
            'poin' => [
                'id' => $poin->id,
                'nama' => $poin->nama,
                'jumlah_poin' => $poin->jumlah_poin,
                'harga' => $poin->harga,
            ],
        ]);
    }

    public function create_poin()
    {
        return Inertia::render('Role/Admin/Poin/Tambah');
    }

    public function store_poin(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jumlah_poin' => 'required|integer|min:0',
            'harga' => 'required|integer|min:0',
        ]);

        $poin = Poin::create([
            'nama' => $request->nama,
            'jumlah_poin' => $request->jumlah_poin,
            'harga' => $request->harga,
        ]);

        $this->logActivity('Tambah', "Data poin dengan ID {$poin->id} ditambah", $poin);


        return redirect()->route('poin.index_poin')->with('success', 'Poin berhasil ditambahkan.');
    }

    public function edit_poin($id)
    {
        $poin = Poin::findOrFail($id);
        return Inertia::render('Role/Admin/Poin/Edit', [
            'poin' => [
                'id' => $poin->id,
                'nama' => $poin->nama,
                'jumlah_poin' => $poin->jumlah_poin,
                'harga' => $poin->harga,
            ],
        ]);
    }

    public function update_poin(Request $request, $id)
    {
        $poin = Poin::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'jumlah_poin' => 'required|integer|min:0',
            'harga' => 'required|integer|min:0',
        ]);

        $poin->update([
            'nama' => $request->nama,
            'jumlah_poin' => $request->jumlah_poin,
            'harga' => $request->harga,
        ]);

        $this->logActivity('Edit', "Data poin dengan ID {$poin->id} diedit", $poin);


        return redirect()->route('poin.index_poin')->with('success', 'Poin berhasil diperbarui.');
    }

    public function destroy_poin($id)
    {
        $poin = Poin::findOrFail($id);
        $poin->delete();

        $this->logActivity('Hapus', "Data poin dengan ID {$poin->id} dihapus", $poin);


        return redirect()->route('poin.index_poin')->with('success', 'Poin berhasil dihapus.');
    }



    // LEMBAGA ADMINNN

    public function index_lembaga()
    {
        // Ambil semua lembaga beserta jumlah staff dan peserta yang terkait
        $lembagas = Lembaga::withCount(['staff', 'peserta'])->get();
    
        // Format data untuk dikirim ke frontend
        $formattedLembagas = $lembagas->map(function ($lembaga) {
            return [
                'id' => $lembaga->id,
                'nama_lembaga' => $lembaga->nama_lembaga,
                'alamat' => $lembaga->alamat,
                'kabupaten' => $lembaga->kabupaten,
                'jenis' => $lembaga->jenis,
                'username' => $lembaga->username,
                'email' => $lembaga->email,
                'nama_lengkap' => $lembaga->nama_lengkap,
                'whatsapp' => $lembaga->whatsapp,
                'jumlah_staff' => $lembaga->staff_count, // Jumlah staff terkait
                'jumlah_peserta' => $lembaga->peserta_count, // Jumlah peserta terkait
                'poin' => $lembaga->poin,
            ];
        });
    
        // Kirim data ke frontend menggunakan Inertia
        return Inertia::render('Role/Admin/Lembaga', [
            'lembagas' => $formattedLembagas,
        ]);
    }

    public function show_lembaga($id)
{
    // Ambil data lembaga berdasarkan ID beserta jumlah staff dan peserta yang terkait
    $lembaga = Lembaga::withCount(['staff', 'peserta'])->findOrFail($id);

    // Format data untuk dikirim ke frontend
    $formattedLembaga = [
        'id' => $lembaga->id,
        'nama_lembaga' => $lembaga->nama_lembaga,
        'alamat' => $lembaga->alamat,
        'kabupaten' => $lembaga->kabupaten,
        'jenis' => $lembaga->jenis,
        'username' => $lembaga->username,
        'email' => $lembaga->email,
        'nama_lengkap' => $lembaga->nama_lengkap,
        'whatsapp' => $lembaga->whatsapp,
        'jumlah_staff' => $lembaga->staff_count, // Jumlah staff terkait
        'jumlah_peserta' => $lembaga->peserta_count, // Jumlah peserta terkait
        'poin' => $lembaga->poin,
        'logo' => $lembaga->logo ? asset('storage/' . $lembaga->logo) : null,

    ];

    // Kirim data ke frontend menggunakan Inertia
    return Inertia::render('Role/Admin/Lembaga/Detail', [
        'lembaga' => $formattedLembaga,
    ]);
}





    // HALAMANNN HOME PAGEEEEEEEE

        public function welcome()
        {
            // Ambil data dari semua model
            $keunggulans = Keunggulan::all()->map(function ($keunggulan) {
                return [
                    'id' => $keunggulan->id,
                    'nama_keunggulan' => $keunggulan->nama_keunggulan,
                    'deskripsi' => $keunggulan->deskripsi,
                    'gambar' => $keunggulan->gambar ? asset('storage/' . $keunggulan->gambar) : null,
                ];
            });
    
            $fiturs = Fitur::all()->map(function ($fitur) {
                return [
                    'id' => $fitur->id,
                    'nama_fitur' => $fitur->nama_fitur,
                    'deskripsi' => $fitur->deskripsi,
                    'gambar' => $fitur->gambar ? asset('storage/' . $fitur->gambar) : null,
                ];
            });
    
            $testimonis = Testimoni::all()->map(function ($testimoni) {
                return [
                    'id' => $testimoni->id,
                    'nama' => $testimoni->nama,
                    'jabatan' => $testimoni->jabatan,
                    'isi' => $testimoni->isi,
                    'foto' => $testimoni->foto ? asset('storage/' . $testimoni->foto) : null,
                ];
            });
    
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

           // Ambil semua data lembaga
                $lembagas = Lembaga::all(); // Mengambil semua data lembaga

                // Proses data lembaga
                $lembagaData = $lembagas->map(function ($lembaga) {
                    return [
                        'id' => $lembaga->id,
                        'nama_lembaga' => $lembaga->nama_lembaga,
                        'logo' => $lembaga->logo ? asset('storage/' . $lembaga->logo) : null,
                    ];
                });

                // Kirim semua data ke halaman welcome.jsx
                return Inertia::render('Welcome', [
                    'keunggulans' => $keunggulans,
                    'fiturs' => $fiturs,
                    'testimonis' => $testimonis,
                    'abouts' => $abouts,
                    'lembagas' => $lembagaData, // Kirim semua data lembaga
                ]);

        }
    

}
