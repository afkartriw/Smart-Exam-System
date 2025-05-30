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
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Kolom untuk nama fitur
            $table->string('logo1')->nullable(); // Kolom untuk gambar (dapat bernilai NULL jika tidak ada gambar)
            $table->string('logo2')->nullable(); // Kolom untuk gambar (dapat bernilai NULL jika tidak ada gambar)
            $table->text('slogan'); // Kolom untuk deskripsi fitur
            $table->text('subSlogan'); // Kolom untuk deskripsi fitur
            $table->text('deskripsi'); // Kolom untuk deskripsi fitur
            $table->text('alamat'); // Kolom untuk deskripsi fitur
            $table->string('phone'); // Kolom untuk deskripsi fitur
            $table->string('email'); // Kolom untuk deskripsi fitur
            $table->string('linkYT'); // Kolom untuk deskripsi fitur
            $table->string('linkDrive'); // Kolom untuk deskripsi fitur
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};
