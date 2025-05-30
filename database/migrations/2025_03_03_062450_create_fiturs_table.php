<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fiturs', function (Blueprint $table) {
            $table->id(); // Kolom ID utama
            $table->string('nama_fitur'); // Kolom untuk nama fitur
            $table->text('deskripsi'); // Kolom untuk deskripsi fitur
            $table->string('gambar')->nullable(); // Kolom untuk gambar (dapat bernilai NULL jika tidak ada gambar)
            $table->timestamps(); // Kolom timestamps (created_at, updated_at)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiturs');
    }
};
