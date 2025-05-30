<?php

namespace App\Http\Controllers;

use App\Models\Lembaga;
use App\Models\User;
use App\Models\Peserta;
use App\Models\Staff;
use App\Models\SesiUjian;
use App\Models\paketSoal;
use App\Models\Poin;
use App\Models\Order;
use App\Models\Kewenangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Mews\Captcha\Facades\Captcha;
use Inertia\Inertia;
use App\Traits\LogsActivity;


use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;

class LembagaController extends Controller 
{

    use LogsActivity;

    public function dashboard()
{
    // Ambil user yang sedang login
    $user = Auth::user();
    
    // Ambil lembaga berdasarkan user_id
    $lembaga = Lembaga::where('user_id', $user->id)->first();

    // Hitung jumlah staff yang terkait dengan lembaga tersebut
    $totalStaff = $lembaga->staff()->count();
    
    // Hitung jumlah peserta yang terdaftar di lembaga tersebut
    $totalPeserta = $lembaga->peserta()->count();
    
    // Hitung jumlah sesi ujian yang terkait dengan lembaga tersebut
    // Menggunakan hasManyThrough untuk mendapatkan sesi ujian melalui paket soal
    $totalSesiUjian = $lembaga->sesiUjian()->count();
    
    // Hitung jumlah paket soal yang terkait dengan lembaga tersebut
    $totalPaketSoal = $lembaga->paketSoal()->count();
    
    // Hitung total poin terjual untuk lembaga tersebut
    $totalPoinTerjual = Order::where('status', 'settlement')
            ->whereHas('lembaga', function ($query) use ($lembaga) {
                $query->where('id', $lembaga->id);
            })
            ->with('poin') // Eager load relasi poin
            ->get()
            ->sum(function ($order) {
                return $order->poin->jumlah_poin; // Ambil jumlah_poin dari relasi poin
            });

    // Hitung jumlah transaksi (order) untuk lembaga tersebut
    $totalTransaksi = Order::whereHas('lembaga', function ($query) use ($lembaga) {
        $query->where('id', $lembaga->id);
    })->count();

    // Ambil data log activity untuk lembaga tersebut
    $logs = ActivityLog::with(['user', 'lembaga'])
        ->where('lembaga_id', $lembaga->id)
        ->latest()
        ->get();

    // Format log activity
    $formattedLogs = $logs->map(function ($log) {
        return [
            'id' => $log->id,
            'user' => $log->user ? $log->user->name : 'Unknown', // Tambahkan atribut user
            'lembaga' => $log->lembaga ? $log->lembaga->nama_lembaga : 'System',
            'date' => $log->created_at->format('F d, Y'),
            'time' => $log->created_at->format('H.i'),
            'action' => $log->action,
            'description' => $log->description,
        ];
    });

    // Kirim data ke view
    return Inertia::render('Role/Lembaga/Dashboard', [
        'lembaga' => $lembaga,
        'totalStaff' => $totalStaff,
        'totalPeserta' => $totalPeserta,
        'totalSesiUjian' => $totalSesiUjian,
        'totalPaketSoal' => $totalPaketSoal,
        'totalPoinTerjual' => $totalPoinTerjual,
        'totalTransaksi' => $totalTransaksi,
        'logs' => $formattedLogs,
    ]);
}




                 //LEMBAGA//
    

    public function index() {
        $lembagas = Lembaga::all();
        return response()->json($lembagas);
    }


    public function show($id)
    {
        // Ambil user yang sedang login
        $user = Auth::user();
    
        // Cari lembaga berdasarkan ID
        $lembaga = Lembaga::select(
            'id', 
            'nama_lembaga', 
            'alamat', 
            'kabupaten', 
            'jenis', 
            'username', 
            'email', 
            'nama_lengkap', 
            'whatsapp'
        )->findOrFail($id);
    
        // Pastikan user hanya bisa melihat lembaganya sendiri
        if ($user->email !== $lembaga->email) {
            abort(403, 'Anda tidak memiliki akses ke lembaga ini.');
        }
    
        return Inertia::render('Role/Lembaga/Dashboard', [
            'lembaga' => $lembaga
        ]);
    }
    
    
    

    public function store(Request $request) {
        $request->validate([
            'nama_lembaga' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'kabupaten' => 'required|string|max:255',
            'jenis' => 'required|string|max:225',
            'username' => 'required|string|max:255|unique:lembagas,username',
            'email' => 'required|string|email|max:255|unique:lembagas,email|unique:users,email',
            'nama_lengkap' => 'required|string|max:225',
            'whatsapp' => 'required|string|max:20',
            'captcha' => 'required|captcha',
        ]);
    
        // Generate password acak
        $password = Str::random(8);
    
        // Buat user untuk login
        $user = User::create([
            'name' => $request->nama_lengkap,
            'email' => $request->email,
            'password' => Hash::make($password),
            'role' => 'lembaga',
            'google_id' => null, 
        ]);
    
        // Simpan data ke tabel lembaga dengan user_id
        $lembaga = Lembaga::create([
            'nama_lembaga' => $request->nama_lembaga,
            'alamat' => $request->alamat,
            'kabupaten' => $request->kabupaten,
            'jenis' => $request->jenis,
            'username' => $request->username,
            'email' => $request->email,
            'nama_lengkap' => $request->nama_lengkap,
            'whatsapp' => $request->whatsapp,
            'user_id' => $user->id, // Simpan user_id
        ]);
    
        // Kirim email dengan kredensial login
        Mail::raw("Akun Anda telah dibuat. \nEmail: {$request->email} \nPassword: {$password}", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Akun Lembaga Anda');
        });

        $this->logActivity('Baru', "Data Lembaga dengan ID {$lembaga->id} bergabung", $lembaga);
    
        return redirect()->route('login')->with('success', 'Pendaftaran berhasil! Cek email Anda untuk kredensial login.');
    }
    



    public function getJenisLembaga() {
        $jenis = [
            ['id' => 1, 'nama' => 'SD/Sederajat'],
            ['id' => 2, 'nama' => 'SMP/Sederajat'],
            ['id' => 3, 'nama' => 'SMA/Sederajat'],
            ['id' => 4, 'nama' => 'Perguruan Tinggi'],
            ['id' => 5, 'nama' => 'Perusahaan'],
        ];
        return response()->json($jenis);
    }

    public function getKabupatenKota() {
        $kabupatenKota = json_decode(file_get_contents(storage_path('app/kabupaten_kota.json')), true);
        return response()->json($kabupatenKota);
    }


    
    public function storeStaff(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user || $user->role !== 'lembaga') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $lembaga = Lembaga::where('user_id', $user->id)->first();
            if (!$lembaga) {
                return response()->json(['message' => 'Lembaga tidak ditemukan atau belum terdaftar'], 404);
            }

            $validated = $request->validate([
                'nama_staff' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:staff,email|unique:users,email',
            ]);

            $password = Str::random(8);

            $userStaff = User::create([
                'name' => $validated['nama_staff'],
                'email' => $validated['email'],
                'password' => Hash::make($password),
                'role' => 'staff',
            ]);

            $staff = Staff::create([
                'lembaga_id' => $lembaga->id,
                'user_id' => $userStaff->id,
                'nama_staff' => $validated['nama_staff'],
                'email' => $validated['email'],
                'peserta' => $request->peserta, // Ambil dari request
                'paket_soal' => $request->paket_soal, // Ambil dari request
                'sesi' => $request->sesi, // Ambil dari request
                'pengawas' => $request->pengawas, // Ambil dari request
            ]);

            Mail::raw("Akun staff Anda telah dibuat.\nEmail: {$validated['email']}\nPassword: {$password}", function ($message) use ($validated) {
                $message->to($validated['email'])
                    ->subject('Akun Staff Anda');
            });

            $this->logActivity('Tambah', "Data staff dengan ID {$staff->id} ditambah", $staff);

            return redirect()->route('staff.index')->with('success', 'Pendaftaran berhasil! Cek email Anda untuk kredensial login.');

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan, silakan coba lagi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storePeserta(Request $request) {
        $request->validate([
            'nama_peserta' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:pesertas,email|unique:users,email',
            'kelompok' => 'required|string|max:255',
         
        ]);
    
        // Ambil user yang sedang login
        $user = auth()->user();
    
        // Pastikan user adalah bagian dari lembaga
        $lembaga = Lembaga::where('user_id', $user->id)->first();
        if (!$lembaga) {
            return response()->json(['message' => 'Lembaga tidak ditemukan atau belum terdaftar'], 404);
        }
            // Generate nomor peserta (mulai dari 100 dan bertambah)
        $lastPeserta = Peserta::latest('id')->first();
        $noPesertaBaru = $lastPeserta ? str_pad($lastPeserta->id + 1, 8, '0', STR_PAD_LEFT) : '00000001';


        
        $password = Str::random(8);
    
        $userPeserta = User::create([
            'name' => $request->nama_peserta,
            'email' => $request->email,
            'password' => Hash::make($password),
            'role' => 'peserta',
        ]);
    
        $peserta = Peserta::create([
            'user_id' => $userPeserta->id,
            'lembaga_id' => $lembaga->id, // Menyimpan lembaga_id
            'nama_peserta' => $request->nama_peserta,
            'email' => $request->email,
            'no_peserta' => $noPesertaBaru, // No peserta otomatis
            'kelompok' => $request->kelompok,
        
        ]);
    
        Mail::raw("Akun peserta Anda telah dibuat.\nEmail: {$request->email}\nPassword: {$password}", function ($message) use ($request) {
            $message->to($request->email)
                ->subject('Akun Peserta Anda');
        });

        $this->logActivity('Tambah', "Data peserta dengan ID {$peserta->id} ditambah", $peserta);
    
        return redirect()->route('peserta.index')->with('success', 'Pendaftaran peserta berhasil! Cek email untuk kredensial login.');
    }
    


    //NEW AFKAR
        // BELIII POINNN

        public function index_belipoin()
        {
            return Inertia::render('Role/Lembaga/Belipoin', [
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
    
        // RIWAYATTT
    
        public function index_riwayat()
        {
            // Ambil user yang sedang login
            $user = Auth::user();
    
            // Ambil data lembaga berdasarkan user_id
            $lembaga = Lembaga::where('user_id', $user->id)->first();
    
            if (!$lembaga) {
                return redirect()->back()->with('alert-failed', 'Lembaga tidak ditemukan');
            }
    
            // Ambil semua order yang terkait dengan lembaga ini
            $orders = Order::with(['lembaga', 'poin'])
                ->where('lembaga_id', $lembaga->id) // Filter berdasarkan lembaga_id
                ->orderBy('created_at', 'desc') // Urutkan berdasarkan tanggal terbaru
                ->get();
    
            return Inertia::render('Role/Lembaga/Riwayat', ['orders' => $orders]);
        }
    
        public function show_riwayat($id)
        {
            // Ambil user yang sedang login
            $user = Auth::user();
    
            // Ambil data lembaga berdasarkan user_id
            $lembaga = Lembaga::where('user_id', $user->id)->first();
    
            if (!$lembaga) {
                return redirect()->back()->with('alert-failed', 'Lembaga tidak ditemukan');
            }
    
            // Ambil order berdasarkan id dan pastikan order tersebut milik lembaga yang login
            $order = Order::with(['lembaga', 'poin'])
                ->where('id', $id)
                ->where('lembaga_id', $lembaga->id) // Filter berdasarkan lembaga_id
                ->first();
    
            if (!$order) {
                return redirect()->back()->with('alert-failed', 'Order tidak ditemukan');
            }
    
            return Inertia::render('Role/Lembaga/Riwayat/Detail', ['order' => $order]);
        }
    
    
        // PROFILL
        // PROFILL
        // PROFILL
        
        public function edit()
        {
            $lembaga = Auth::user()->lembaga;
        
            // Tambahkan logo_url jika logo ada
            $lembaga->logo_url = $lembaga->logo ? Storage::url($lembaga->logo) : null;
        
            return Inertia::render('Role/Lembaga/Profile', [
                'lembaga' => $lembaga
            ]);
        }
    
        public function update(Request $request)
        {
            $lembaga = Auth::user()->lembaga;
    
            $validated = $request->validate([
                'nama_lembaga' => 'required|string|max:255',
                'alamat' => 'required|string',
                'kabupaten' => 'required|string',
                'jenis' => 'required|string',
                'whatsapp' => 'required|string|max:15',
                'nama_lengkap' => 'required|string|max:255',
                'logo' => 'nullable|image|max:2048',
            ]);
    
            // Handle logo upload
            if ($request->hasFile('logo')) {
                // Hapus logo lama jika ada
                if ($lembaga->logo && Storage::exists($lembaga->logo)) {
                    Storage::delete($lembaga->logo);
                }
                // Simpan logo baru
                $validated['logo'] = $request->file('logo')->store('logos', 'public');
            } else {
                // Jika tidak ada logo baru, gunakan logo lama
                $validated['logo'] = $lembaga->logo;
            }
    
            // Update data lembaga
            $lembaga->update($validated);

            $this->logActivity('Edit', "Data profil dengan ID {$lembaga->id} diedit", $lembaga);
    
            return redirect()->back()->with('success', 'Profil berhasil diperbarui');
        }
    
}