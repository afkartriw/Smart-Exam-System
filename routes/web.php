<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    ProfileController,
    AdminController,
    CaptchaController,
    GoogleController,
    LembagaController,
    LoginController,
    StaffController,
    PesertaController,
    PaketSoalController,
    UjianController,
    SoalController,
    SoalImportController,
    SesiUjianController,
    PengawasUjianController,
    UjianPesertaController,
    PembayaranController





};


// Halaman Utama
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [AdminController::class, 'welcome']);


// Dashboard (Hanya untuk pengguna yang terautentikasi)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile (Hanya untuk pengguna yang login)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Halaman Autentikasi
Route::get('/konfirmasi', fn() => Inertia::render('Auth/Konfirmasi'));
Route::get('/daftar', fn() => Inertia::render('Auth/Daftar'));

// =========================
// Rute Khusus Berdasarkan Role
// =========================

// PESERTA (Hanya untuk role 'peserta')
Route::middleware(['auth', 'role:peserta'])->group(function () {
    // Route::get('/peserta', fn() => Inertia::render('Role/Peserta/Peserta'));
    Route::get('/peserta', [PesertaController::class, 'index_sesi'])->name('peserta.dashboard');
    Route::get('/peserta/sesi/{sesiUjian}/detail', [PesertaController::class, 'showDetailSesi'])->name('peserta.sesi.detail');
        // Route::get('/peserta/sesi/{sesiUjian}/detail', [PesertaUjianController::class, 'showDetailSesi'])->name('peserta.sesi.detail');

    // Route to start the exam
    Route::get('/peserta/sesi/{sesi}/ujian/{paketSoal}/soal/{soal}', [PesertaController::class, 'showSoal'])
    ->name('peserta.sesi.ujian.soal');
    Route::post('/jawaban-peserta', [UjianController::class, 'simpan']);
    Route::post('/ujian/selesai', [UjianController::class, 'selesaikan']);
});

// ADMIN (Hanya untuk role 'admin')
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', fn() => Inertia::render('Role/Admin/Dashboard'));
    Route::get('/admin/lembaga', fn() => Inertia::render('Role/Admin/Lembaga'));
    Route::get('/admin/fitur', fn() => Inertia::render('Role/Admin/Fitur'));
    Route::get('/admin/fitur/tambah', fn() => Inertia::render('Role/Admin/Fitur/Tambah'));
    Route::get('/admin/aboutus', fn() => Inertia::render('Role/Admin/Aboutus'));
    Route::get('/admin/keunggulan', fn() => Inertia::render('Role/Admin/Keunggulan'));
    Route::get('/admin/testimoni', fn() => Inertia::render('Role/Admin/Testimoni'));
    Route::get('/admin/pembayaran', fn() => Inertia::render('Role/Admin/Pembayaran'));
    Route::get('/admin/pembayaran/edit', fn() => Inertia::render('Role/Admin/Pembayaran/Edit'));


    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/lembaga', [AdminController::class, 'index_lembaga'])->name('lembaga.index_lembaga');
    Route::get('/admin/lembaga/detail/{id}', [AdminController::class, 'show_lembaga'])->name('order.show_lembaga');



    Route::get('/admin/aboutus', [AdminController::class, 'index_about'])->name('about.index_about');
    Route::post('/admin/aboutus/{about}', [AdminController::class, 'update_about'])->name('about.update_about');
    Route::put('/admin/aboutus/{about}', [AdminController::class, 'update_about'])->name('aboutus.update_about');


    Route::get('/admin/pembayaran', [AdminController::class, 'index_order'])->name('order.index_order');
    Route::get('/admin/order/detail/{id}', [AdminController::class, 'show_order'])->name('order.index_order');


    Route::get('/admin/fitur', [AdminController::class, 'index_fitur'])->name('fitur.index_fitur');
    Route::get('/admin/fitur/tambah', [AdminController::class, 'create_fitur'])->name('fitur.create_fitur');
    Route::post('/admin/fitur', [AdminController::class, 'store_fitur'])->name('fitur.store_fitur');
    Route::get('/admin/fitur/{id}', [AdminController::class, 'show_fitur'])->name('fitur.show_fitur');
    Route::get('/admin/fitur/{id}/detail', [AdminController::class, 'show_fitur'])->name('fitur.show_fitur');
    Route::get('/admin/fitur/{id}/edit', [AdminController::class, 'edit_fitur'])->name('fitur.edit_fitur');
    Route::post('/admin/fitur/{id}', [AdminController::class, 'update_fitur'])->name('fitur.update_fitur');
    Route::delete('/admin/fitur/{id}', [AdminController::class, 'destroy_fitur'])->name('fitur.destroy_fitur');

    
    Route::get('/admin/keunggulan', [AdminController::class, 'index_keunggulan'])->name('keunggulan.index_keunggulan');
    Route::get('/admin/keunggulan/tambah', [AdminController::class, 'create_keunggulan'])->name('keunggulan.create_keunggulan');
    Route::post('/admin/keunggulan', [AdminController::class, 'store_keunggulan'])->name('keunggulan.store_keunggulan');
    Route::get('/admin/keunggulan/{id}', [AdminController::class, 'show_keunggulan'])->name('keunggulan.show_keunggulan');
    Route::get('/admin/keunggulan/{id}/edit', [AdminController::class, 'edit_keunggulan'])->name('keunggulan.edit_keunggulan');
    Route::get('/admin/keunggulan/{id}/detail', [AdminController::class, 'show_keunggulan'])->name('keunggulan._keunggulan');
    Route::post('/admin/keunggulan/{id}', [AdminController::class, 'update_keunggulan'])->name('keunggulan.update_keunggulan');
    Route::delete('/admin/keunggulan/{id}', [AdminController::class, 'destroy_keunggulan'])->name('keunggulan.destroy_keunggulan');


    Route::get('/admin/testimoni', [AdminController::class, 'index_testimoni'])->name('testimoni.index_testimoni');
    Route::get('/admin/testimoni/tambah', [AdminController::class, 'create_testimoni'])->name('testimoni.create_testimoni');
    Route::post('/admin/testimoni', [AdminController::class, 'store_testimoni'])->name('testimoni.store_testimoni');
    Route::get('/admin/testimoni/{id}', [AdminController::class, 'show_testimoni'])->name('testimoni.show_testimoni');
    Route::get('/admin/testimoni/{id}/detail', [AdminController::class, 'show_testimoni'])->name('testimoni.show_testimoni');
    Route::get('/admin/testimoni/{id}/edit', [AdminController::class, 'edit_testimoni'])->name('testimoni.edit_testimoni');
    Route::post('/admin/testimoni/{id}', [AdminController::class, 'update_testimoni'])->name('testimoni.update_testimoni');
    Route::delete('/admin/testimoni/{id}', [AdminController::class, 'destroy_testimoni'])->name('testimoni.destroy_testimoni');


    Route::get('/admin/poin', [AdminController::class, 'index_poin'])->name('poin.index_poin');
    Route::get('/admin/poin/tambah', [AdminController::class, 'create_poin'])->name('poin.create_poin');
    Route::post('/admin/poin', [AdminController::class, 'store_poin'])->name('poin.store_poin');
    Route::get('/admin/poin/{id}/detail', [AdminController::class, 'show_poin'])->name('poin.detail');
    Route::get('/admin/poin/{id}/edit', [AdminController::class, 'edit_poin'])->name('poin.edit');
    Route::put('/admin/poin/{id}', [AdminController::class, 'update_poin'])->name('poin.update');
    Route::post('/admin/poin/{id}', [AdminController::class, 'update_poin'])->name('poin.update_poin');
    Route::delete('/admin/poin/{id}', [AdminController::class, 'destroy_poin'])->name('poin.destroy_poin');

});

// LEMBAGA (Hanya untuk role 'lembaga')
Route::middleware(['auth', 'role:lembaga'])->group(function () {
    Route::get('/lembaga', fn() => Inertia::render('Role/Lembaga/Dashboard'))->name('lembaga.dashboard');
    Route::get('/lembaga', [LembagaController::class, 'dashboard'])->name('lembaga.dashboard');

    Route::get('/lembaga/staff', [StaffController::class, 'index'])->name('staff.index');
    Route::get('/lembaga/staff/tambah', [StaffController::class, 'create'])->name('staff.create');
    Route::post('/lembaga/staff', [StaffController::class, 'store'])->name('staff.store');
    Route::get('/lembaga/staff/{id}', [StaffController::class, 'show'])->name('staff.show');
    Route::get('/lembaga/staff/{id}/edit', [StaffController::class, 'edit'])->name('staff.edit');
    Route::put('/lembaga/staff/{id}', [StaffController::class, 'update'])->name('staff.update');
    Route::delete('/lembaga/staff/{id}', [StaffController::class, 'destroy'])->name('staff.destroy');

    // Peserta Routes
    Route::get('/lembaga/peserta', [PesertaController::class, 'index'])->name('peserta.index');
    Route::get('/lembaga/peserta/import', fn() => Inertia::render('Role/Lembaga/Peserta/Import'))->name('peserta.import');
    Route::post('/peserta/import', [PesertaController::class, 'import'])->name('store.import');
    Route::get('/lembaga/peserta/tambah', [PesertaController::class, 'create'])->name('peserta.create');
    Route::post('/lembaga/peserta', [PesertaController::class, 'store'])->name('peserta.store');
    Route::get('/lembaga/peserta/{id}/edit', [PesertaController::class, 'edit'])->name('peserta.edit');
    Route::put('/lembaga/peserta/{id}', [PesertaController::class, 'update'])->name('peserta.update');
    Route::delete('/lembaga/peserta/{id}', [PesertaController::class, 'destroy'])->name('peserta.destroy');
    Route::delete('/lembaga/peserta', [PesertaController::class, 'destroyAll'])->name('peserta.destroyAll');
    ///PAKETSOAL//
    Route::get('/lembaga/paketsoal', [PaketSoalController::class, 'index'])->name('paket.index');
    Route::post('lembaga/paketsoal', [PaketSoalController::class, 'store'])->name('paketsoal.store');
    Route::get('lembaga/paketsoal/{id}/edit', [PaketSoalController::class, 'edit'])->name('paketsoal.edit');
    Route::put('lembaga/paketsoal/{id}', [PaketSoalController::class, 'update'])->name('paketsoal.update');
    Route::delete('lembaga/paketsoal/{id}', [PaketSoalController::class, 'destroy'])->name('paketsoal.destroy');
    Route::get('/lembaga/paketsoal/tambah', fn() => Inertia::render('Role/Lembaga/PaketSoal/Tambah'));
    Route::get('/lembaga/paketsoal/edit', fn() => Inertia::render('Role/Lembaga/PaketSoal/Edit'));
    ////SOAL///
    Route::post('/soal/store', [SoalController::class, 'store'])->name('soal.store');
    Route::get('/lembaga/paketsoal/{id}/show', [SoalController::class, 'show'])->name('soal.show');
    Route::delete('/lembaga/paketsoal/{paketSoal}/soal/{soal}', [SoalController::class, 'destroy'])->name('soal.destroy');
    Route::get('/lembaga/paketsoal/{paketSoal}/soal/{soal}/edit', [SoalController::class, 'edit'])->name('soal.edit');

    // Update soal
    Route::put('/lembaga/paketsoal/{paketSoal}/soal/{soal}', [SoalController::class, 'update'])->name('soal.update');

   
    Route::get('/lembaga/paketsoal/soal/{id}', function ($id) {
        return Inertia::render('Role/Lembaga/PaketSoal/Soal', [
            'id' => $id, // Kirim ID ke frontend
        ]);
    });
    ///EXCEL//
    Route::get('/lembaga/paketsoal/soal/{paketSoal}/import', [SoalImportController::class, 'show'])->name('import.excel');
    Route::post('/import-excel', [SoalImportController::class, 'importExcel'])->name('import.soal');
    // Route::post('/import-word', [SoalImportController::class, 'importWord'])->name('import.word');

    ///SESI//
    Route::get('/lembaga/sesi', [SesiUjianController::class, 'index'])->name('sesi_ujian.index');
    Route::get('/lembaga/sesi/tambah', [SesiUjianController::class, 'create'])->name('sesi_ujian.create');
    Route::post('/lembaga/sesi', [SesiUjianController::class, 'store'])->name('sesi_ujian.store');
    Route::get('/lembaga/sesi/{sesiUjian}/show', [SesiUjianController::class, 'show'])->name('sesi_ujian.show');
    Route::get('/lembaga/sesi/{sesiUjian}/edit', [SesiUjianController::class, 'edit'])->name('sesi_ujian.edit');
    Route::put('/lembaga/sesi/{sesiUjian}', [SesiUjianController::class, 'update'])->name('sesi_ujian.update');
    Route::delete('/lembaga/sesi/{sesiUjian}', [SesiUjianController::class, 'destroy'])->name('sesi_ujian.destroy');

    

    Route::patch('/sesi-ujian/{id}/set-status', [SesiUjianController::class, 'setPesertaStatus'])
    ->name('sesi_ujian.set_status');

    // Route::get('/lembaga/pengawas', fn() => Inertia::render('Role/Lembaga/Pengawas'));
    Route::get('/lembaga/pengawas', [PengawasUjianController::class, 'index'])->name('pengawas.index');
    Route::get('/lembaga/pengawas/{sesiUjian}/show', [PengawasUjianController::class, 'show'])->name('pengawas.show');
    Route::get('/lembaga/laporan', fn() => Inertia::render('Role/Lembaga/Laporan'));
    Route::get('/lembaga/belipoin', fn() => Inertia::render('Role/Lembaga/Belipoin'));
    Route::get('/lembaga/belipoin/pilih', fn() => Inertia::render('Role/Lembaga/BeliPoin/Pilih'));



    //NEW AFKAR
    // PROFILLL
    Route::get('/lembaga/profile', fn() => Inertia::render('Role/Lembaga/Profil'));
    Route::get('/lembaga/profile', [LembagaController::class, 'edit'])->name('lembaga.edit');
    Route::post('/lembaga/update', [LembagaController::class, 'update'])->name('lembaga.update');
    //BELI POIN
    Route::get('/lembaga/belipoin', [LembagaController::class, 'index_belipoin']);
    Route::post('/lembaga/belipoin/custom', [LembagaController::class, 'beliPoinCustom']);    
    Route::get('/lembaga/belipoin/{id_poin}', [PembayaranController::class, 'payment'])->name('lembaga.pembayaran');
    //PEMBAYARAN
    Route::get('/lembaga/pembayaran', [PembayaranController::class, 'payment']);
    Route::post('/lembaga/pembayaran', [PembayaranController::class, 'payment_post']);
    Route::post('/lembaga/pembayaran', [PembayaranController::class, 'payment_post'])->name('lembaga.pembayaran.post');
    //RIWAYATTTT
    Route::get('/lembaga/riwayat', [LembagaController::class, 'index_riwayat'])->name('riwayat.index_riwayat');
    Route::get('/lembaga/riwayat/detail/{id}', [LembagaController::class, 'show_riwayat'])->name('riwayat.show_riwayat');




    //post//
    Route::post('/staff-store', [LembagaController::class, 'storeStaff'])->name('staff.store');
    Route::post('/peserta-store', [LembagaController::class, 'storePeserta'])->name('peserta.store');
    Route::patch('/lembaga/staff/{id}', [StaffController::class, 'updateStatus']);
});

// STAFF (Hanya untuk role 'staff')
Route::middleware(['auth', 'role:staff'])->group(function () {
    Route::get('/staff', fn() => Inertia::render('Role/Staff/Dashboard'));
    Route::get('/staff/profile', fn() => Inertia::render('Role/Admin/Profil'));
    Route::get('/staff/peserta', fn() => Inertia::render('Role/Admin/Peserta'));



        // Peserta Routes
    Route::get('/staff/peserta', [PesertaController::class, 'index_staff'])->name('peserta.index_staff');
    Route::get('/staff/peserta/import', fn() => Inertia::render('Role/Staff/Peserta/Import'))->name('peserta.import_staff');
    Route::post('/peserta/import', [PesertaController::class, 'import_staff'])->name('store.import_staff');
    Route::get('/staff/peserta/tambah', [PesertaController::class, 'create_staff'])->name('peserta.create_staff');
    Route::post('/staff/peserta', [PesertaController::class, 'store_staff'])->name('peserta.store_staff');
    Route::get('/staff/peserta/{id}/edit', [PesertaController::class, 'edit_staff'])->name('peserta.edit_staff');
    Route::put('/staff/peserta/{id}', [PesertaController::class, 'update_staff'])->name('peserta.update_staff');
    Route::delete('/staff/peserta/{id}', [PesertaController::class, 'destroy_staff'])->name('peserta.destroy_staff');
    Route::delete('/staff/peserta', [PesertaController::class, 'destroyAll_staff'])->name('peserta.destroyAll_staff');

    // PROFILLL
    Route::get('/staff/profile', [StaffController::class, 'edit_profile'])->name('staff.edit_profile');
    Route::post('/staff/update', [StaffController::class, 'update_profile'])->name('staff.update_profile');
});


// =========================
// CAPTCHA
// =========================
Route::get('/captcha-image', [CaptchaController::class, 'getCaptchaImage'])->name('captcha-image');
Route::get('/captcha/{config?}', fn($config = 'default') => Captcha::create($config))->name('captcha');
Route::post('/verify-captcha', [CaptchaController::class, 'verifyCaptcha']);

// =========================
// Autentikasi Google
// =========================
Route::get('auth/google', [GoogleController::class, 'googlepage'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

/**
 * Routes untuk lembaga & autentikasi
 */
Route::post('/lembaga/register', [LembagaController::class, 'store']);
Route::post('/login/role', [LoginController::class, 'login']);
Route::post('/login', [LoginController::class, 'login'])->middleware('log.activity');
Route::get('/lembaga/jenis', [LembagaController::class, 'getJenisLembaga']);
Route::get('/kabupaten/kota', [LembagaController::class, 'getKabupatenKota']);


Route::get('/ujian/koreksi/{id}', [UjianController::class, 'koreksiOtomatis']);


// =========================
// Rute Otentikasi Laravel
// =========================
require __DIR__.'/auth.php';
