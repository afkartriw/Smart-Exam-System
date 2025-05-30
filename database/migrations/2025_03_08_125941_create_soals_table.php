<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('soals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paket_soal_id')->constrained('paket_soals')->onDelete('cascade');
            $table->text('pertanyaan');
            $table->enum('tipe', ['pilihan_ganda', 'true_false', 'drag_and_drop', 'pencocokan', 'audio', 'video', 'gambar', 'isian', 'esai']);
            $table->enum('metode_koreksi', ['exact', 'fuzzy', 'ai'])->default('exact');
            $table->string('media')->nullable();
            $table->timestamps();
        });

        Schema::create('jawabans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('soal_id')->constrained('soals')->onDelete('cascade');
            $table->text('jawaban'); // Bisa berupa teks, JSON (untuk pencocokan/drag and drop), atau file audio
            $table->enum('tipe', ['pilihan_ganda', 'true_false', 'jawaban_singkat', 'jawaban_panjang', 'pencocokan', 'drag_and_drop']);
            $table->boolean('benar')->nullable(); // Untuk pilihan ganda dan true/false
            $table->timestamps();
        });

        Schema::create('hasil_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('soal_id')->constrained('soals')->onDelete('cascade');
            $table->text('jawaban_diberikan'); // Bisa berupa teks atau file
            $table->decimal('nilai', 5, 2)->nullable(); // Skor setelah dikoreksi
            $table->enum('status_koreksi', ['pending', 'dikoreksi'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hasil_ujian');
        Schema::dropIfExists('jawabans');
        Schema::dropIfExists('soals');
    }
};
