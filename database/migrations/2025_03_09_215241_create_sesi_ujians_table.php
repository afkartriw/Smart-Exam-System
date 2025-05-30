<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSesiUjiansTable extends Migration
{
    public function up()
    {
        Schema::create('sesi_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paket_soal_id')->constrained('paket_soals')->onDelete('cascade');
            
            // Tambahkan kolom lembaga_id dan relasi foreign key
            $table->unsignedBigInteger('lembaga_id');
            $table->foreign('lembaga_id')->references('id')->on('lembagas')->onDelete('cascade');

            $table->string('nama_sesi_ujian');
            $table->enum('mode_peserta', ['Semua', 'Kelompok Peserta', 'Manual']);
            $table->string('kelas_kelompok');
            $table->date('tanggal_pelaksanaan');
            $table->time('waktu_mulai');
            $table->integer('waktu_pengerjaan');
            $table->enum('wajib_kamera', ['ya', 'tidak']);
            $table->enum('batasi_browser', ['ya', 'tidak']);
            $table->enum('tampilkan_hasil', ['ya', 'tidak']);
            $table->enum('tampilkan_pembahasan', ['ya', 'tidak']);
            $table->enum('gunakan_sertifikat', ['ya', 'tidak']);
            $table->text('petunjuk_pengerjaan')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sesi_ujians');
    }
}
