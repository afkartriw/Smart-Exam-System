<?php
namespace App\Imports;

use App\Models\Soal;
use App\Models\Jawaban;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;

class SoalImport implements ToCollection, WithHeadingRow
{
    protected $paketSoalId;

    public function __construct($paketSoalId)
    {
        $this->paketSoalId = $paketSoalId;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $validator = Validator::make($row->toArray(), [
                'pertanyaan' => 'required|string',
                'tipe' => 'required|in:pilihan_ganda,true_false,isian,esai',
                'jawaban_1' => 'nullable|string',
                'benar_1' => 'nullable|boolean',
                'jawaban_2' => 'nullable|string',
                'benar_2' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                continue;
            }

            $metode_koreksi = null;
            if ($row['tipe'] === 'esai') {
                $metode_koreksi = 'ai';
            } elseif ($row['tipe'] === 'isian') {
                $metode_koreksi = 'exact';
            }

            // Simpan soal ke database
            $soal = Soal::create([
                'paket_soal_id' => $this->paketSoalId,
                'pertanyaan' => $row['pertanyaan'],
                'tipe' => $row['tipe'],
                'metode_koreksi' => $metode_koreksi,
                'media' => null,
            ]);

            if ($row['tipe'] === 'true_false') {
                // Jika soal True/False, otomatis simpan dua jawaban: "True" dan "False"
                $jawabanBenar = strtolower($row['benar_1']) === 'true';

                Jawaban::create([
                    'soal_id' => $soal->id,
                    'jawaban' => 'True',
                    'benar' => $jawabanBenar ? 1 : 0,
                ]);

                Jawaban::create([
                    'soal_id' => $soal->id,
                    'jawaban' => 'False',
                    'benar' => $jawabanBenar ? 0 : 1,
                ]);
            } else {
                // Simpan jawaban normal untuk pilihan ganda dan lainnya
                for ($i = 1; $i <= 4; $i++) {
                    if (!empty($row["jawaban_$i"])) {
                        Jawaban::create([
                            'soal_id' => $soal->id,
                            'jawaban' => $row["jawaban_$i"],
                            'benar' => filter_var($row["benar_$i"], FILTER_VALIDATE_BOOLEAN) ? 1 : 0,
                        ]);
                    }
                }
            }
        }
    }
}
