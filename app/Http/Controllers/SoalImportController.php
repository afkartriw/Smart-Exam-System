<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SoalImport;
use App\Models\Soal;
use Illuminate\Support\Facades\Storage;


class SoalImportController extends Controller
{

    public function show($paketSoalId)
    {
        $soal = Soal::where('paket_soal_id', $paketSoalId)
                    ->with(['paketSoal', 'jawabans'])
                    ->get()
                    ->map(function ($item) {
                        $item->media_url = $item->media ? asset(Storage::url($item->media)) : null;
                        return $item;
                    });
    
        return Inertia::render('Role/Lembaga/PaketSoal/Import', [
            'soal' => $soal
        ]);
    }
    
    public function importExcel(Request $request)
    {
       
        $request->validate([
            'file' => 'required|mimes:xlsx|max:307200', // 300 KB
            'paket_soal_id' => 'required|exists:paket_soals,id',
        ]);
    
        Excel::import(new SoalImport($request->paket_soal_id), $request->file('file'));
    
        return redirect()->route('soal.show', ['id' => $request->paket_soal_id]);
    }


}
