<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Traits\LogsActivity;



class StaffController extends Controller
{
    use LogsActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        // Mengambil staff dengan atribut peserta, paket_soal, sesi, dan pengawas
        $staff = Staff::where('lembaga_id', $user->lembaga->id)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'nama_staff' => $s->nama_staff,
                    'email' => $s->email,
                    'peserta' => $s->peserta,
                    'paket_soal' => $s->paket_soal,
                    'sesi' => $s->sesi,
                    'pengawas' => $s->pengawas,
                ];
            });

        return Inertia::render('Role/Lembaga/Staff', [
            'staffs' => $staff ?? []
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Role/Lembaga/Staff/Tambah');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        $request->validate([
            'nama_staff' => 'required|string|max:255',
            'email' => 'required|email|unique:staff,email',
            'peserta' => 'required|in:aktif,tidak_aktif',
            'paket_soal' => 'required|in:aktif,tidak_aktif',
            'sesi' => 'required|in:aktif,tidak_aktif',
            'pengawas' => 'required|in:aktif,tidak_aktif',
        ]);

        // Buat staff baru
        $staff = Staff::create([
            'lembaga_id' => $user->lembaga->id,
            'nama_staff' => $request->nama_staff,
            'email' => $request->email,
            'peserta' => $request->peserta,
            'paket_soal' => $request->paket_soal,
            'sesi' => $request->sesi,
            'pengawas' => $request->pengawas,
        ]);

        $this->logActivity('Tambah', "Data staff ID {$staff->id} ditambah", $staff);


        return redirect()->route('staff.index')->with('success', 'Staff added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        $staff = Staff::where('id', $id)->where('lembaga_id', $user->lembaga->id)->first();
        if (!$staff) {
            return redirect()->route('staff.index')->with('error', 'Staff not found');
        }

        return Inertia::render('Role/Lembaga/Staff/Edit', [
            'staff' => $staff
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return $this->show($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->route('dashboard')->with('error', 'Unauthorized');
        }

        $staff = Staff::where('id', $id)->where('lembaga_id', $user->lembaga->id)->first();
        if (!$staff) {
            return redirect()->route('staff.index')->with('error', 'Staff not found');
        }

        $request->validate([
            'nama_staff' => 'required|string|max:255',
            'email' => 'required|email|unique:staff,email,' . $id,
            'peserta' => 'required|in:aktif,tidak_aktif',
            'paket_soal' => 'required|in:aktif,tidak_aktif',
            'sesi' => 'required|in:aktif,tidak_aktif',
            'pengawas' => 'required|in:aktif,tidak_aktif',
        ]);

        // Update data staff
        $staff->update([
            'nama_staff' => $request->nama_staff,
            'email' => $request->email,
            'peserta' => $request->peserta,
            'paket_soal' => $request->paket_soal,
            'sesi' => $request->sesi,
            'pengawas' => $request->pengawas,
        ]);

        $this->logActivity('Edit', "Data staff ID {$id} diedit", $staff);


        return redirect()->route('staff.index')->with('success', 'Staff updated successfully');
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'lembaga') {
            return redirect()->route('staff.index')->with('error', 'Unauthorized');
        }

        $staff = Staff::where('id', $id)->where('lembaga_id', $user->lembaga->id)->first();
        if (!$staff) {
            return redirect()->route('staff.index')->with('error', 'Staff not found');
        }

        $staff->user()->delete();
        $staff->delete();

        $this->logActivity('Hapus', "Data staff ID {$id} dihapus", $staff);


        return redirect()->route('staff.index')->with('success', 'Staff deleted successfully');
    }

    public function updateStatus(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        
        $allowedFields = ['peserta', 'paket_soal', 'sesi', 'pengawas'];
        foreach ($allowedFields as $field) {
            if ($request->has($field)) {
                $staff->$field = $request->$field === 'aktif' ? 'aktif' : 'tidak_aktif';
            }
        }
        
        $staff->save();

        $this->logActivity('Edit', "Data staff ID {$id} diedit", $staff);

        
        return redirect()->route('staff.index')->with('success', 'Status berhasil diperbarui.');

    }

    public function edit_profile()
    {
        // Ambil data staff yang sedang login
        $staff = Auth::user()->staff;
    
        // Load relasi lembaga
        $staff->load('lembaga');
    
        // Tambahkan photo_url jika photo ada
        $staff->photo_url = $staff->photo ? Storage::url($staff->photo) : null;
    
        return Inertia::render('Role/Staff/Profile', [
            'staff' => $staff
        ]);
    }
    
    public function update_profile(Request $request)
    {
        // Ambil data staff yang sedang login
        $staff = Auth::user()->staff;
    
        // Validasi input
        $validated = $request->validate([
            'nama_staff' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Pastikan format dan ukuran file valid
        ]);
    
        // Handle photo upload jika ada file baru
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            if ($staff->photo && Storage::exists($staff->photo)) {
                Storage::delete($staff->photo);
            }
            // Simpan foto baru
            $validated['photo'] = $request->file('photo')->store('staff_photos', 'public');
        }
    
        // Update data staff
        $staff->update($validated);
    
        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }
}