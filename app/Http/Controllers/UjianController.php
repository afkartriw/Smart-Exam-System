<?php

namespace App\Http\Controllers;

use App\Models\HasilUjian;
use App\Models\JawabanPeserta;
use App\Models\SesiUjian;
use Illuminate\Http\Request;

class UjianController extends Controller {
    public function koreksiOtomatis($hasilUjianId) {
        $jawabanPeserta = JawabanPeserta::where('hasil_ujian_id', $hasilUjianId)->get();
        
        foreach ($jawabanPeserta as $jawaban) {
            $jawaban->koreksi();
        }

        $totalSkor = $jawabanPeserta->sum('nilai');
        HasilUjian::where('id', $hasilUjianId)->update(['total_skor' => $totalSkor]);

        return response()->json(['message' => 'Koreksi selesai', 'total_skor' => $totalSkor]);
    }




    public function simpan(Request $request)
    {
        $request->validate([
            'sesi_ujian_id' => 'required|exists:sesi_ujians,id',
            'soal_id' => 'required|exists:soals,id',
            'user_id' => 'required|exists:users,id',
        ]);
    
        // Update atau buat jawaban peserta
        JawabanPeserta::updateOrCreate(
            [
                'sesi_ujian_id' => $request->sesi_ujian_id,
                'soal_id' => $request->soal_id,
                'user_id' => $request->user_id,
            ],
            [
                'jawaban_id' => $request->jawaban_id,
                'jawaban_teks' => $request->jawaban_teks,
            ]
        );
        }
    

    public function selesaikan(Request $request)
    {
        $request->validate([
            'sesi_ujian_id' => 'required|exists:sesi_ujians,id',
        ]);

        $sesi = SesiUjian::findOrFail($request->sesi_ujian_id);
        $sesi->status = 'selesai'; // asumsi field `status` ada
        $sesi->waktu_selesai = now();
        $sesi->save();

        return response()->json(['message' => 'Ujian berhasil diselesaikan']);
    }
}
