<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('jawaban_pesertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_ujian_id')->constrained('sesi_ujians')->onDelete('cascade');
            $table->foreignId('soal_id')->constrained('soals')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('jawaban_id')->nullable()->constrained('jawabans')->onDelete('set null');
            $table->text('jawaban_teks')->nullable();
            $table->integer('poin')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('jawaban_pesertas');
    }
};
