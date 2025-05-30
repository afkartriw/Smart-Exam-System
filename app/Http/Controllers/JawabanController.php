<?php

namespace App\Http\Controllers;

use App\Models\Jawaban;
use Illuminate\Http\Request;

class JawabanController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'soal_id' => 'required|exists:soals,id',
            'jawaban' => 'required',
            'tipe' => 'required|in:pilihan_ganda,true_false,jawaban_singkat,jawaban_panjang,pencocokan,drag_and_drop',
            'benar' => 'nullable|boolean',
        ]);

        Jawaban::create($request->all());
        return back()->with('success', 'Jawaban berhasil disimpan.');
    }
}
