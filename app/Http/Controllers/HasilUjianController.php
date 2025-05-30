<?php

namespace App\Http\Controllers;

use App\Models\HasilUjian;
use App\Models\Soal;
use Illuminate\Http\Request;

class HasilUjianController extends Controller
{
    public function koreksi(HasilUjian $hasil)
    {
        $soal = $hasil->soal;

        if ($soal->metode_koreksi === 'exact') {
            $hasil->nilai = $this->koreksiExact($hasil->jawaban_diberikan, $soal);
        } elseif ($soal->metode_koreksi === 'fuzzy') {
            $hasil->nilai = $this->koreksiFuzzy($hasil->jawaban_diberikan, $soal);
        } elseif ($soal->metode_koreksi === 'ai') {
            $hasil->nilai = $this->koreksiAI($hasil->jawaban_diberikan, $soal);
        }

        $hasil->status_koreksi = 'dikoreksi';
        $hasil->save();

        return response()->json(['message' => 'Jawaban dikoreksi', 'nilai' => $hasil->nilai]);
    }

    private function koreksiExact($jawabanDiberikan, Soal $soal)
    {
        // Bandingkan langsung dengan jawaban yang benar
        $jawabanBenar = $soal->jawabans()->where('benar', true)->first();
        return ($jawabanDiberikan == $jawabanBenar->jawaban) ? 100 : 0;
    }

    private function koreksiFuzzy($jawabanDiberikan, Soal $soal)
    {
        // Menggunakan algoritma similarity (contoh: Levenshtein)
        $jawabanBenar = $soal->jawabans()->where('benar', true)->first();
        similar_text($jawabanDiberikan, $jawabanBenar->jawaban, $similarity);
        return $similarity;
    }

    private function koreksiAI($jawabanDiberikan, Soal $soal)
    {
        // Misalnya, kita bisa menghubungkan ke layanan AI seperti OpenAI atau Google NLP
        return rand(50, 100); // Contoh skor acak
    }


    public function store(Request $request)
    {
        $request->validate([
            'soal_id' => 'required|exists:soals,id',
            'jawaban_diberikan' => 'required|string',
        ]);

        HasilUjian::create([
            'user_id' => Auth::id(),
            'soal_id' => $request->soal_id,
            'jawaban_diberikan' => $request->jawaban_diberikan,
            'status_koreksi' => 'pending',
        ]);

        return back()->with('success', 'Jawaban berhasil dikirim.');
    }

}
