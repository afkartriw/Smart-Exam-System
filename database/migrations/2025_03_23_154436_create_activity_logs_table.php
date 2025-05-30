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
        // Membuat tabel activity_logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // ID pengguna yang melakukan aktivitas
            $table->unsignedBigInteger('lembaga_id')->nullable(); // ID lembaga (ditambahkan di sini)
            $table->string('action'); // Jenis aktivitas (misalnya: login, create, update, delete)
            $table->string('description')->nullable(); // Deskripsi aktivitas
            $table->string('model_type')->nullable(); // Model yang terlibat (misalnya: User, Post)
            $table->unsignedBigInteger('model_id')->nullable(); // ID model yang terlibat
            $table->timestamps();

            // Foreign key ke tabel users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Foreign key ke tabel lembaga (jika diperlukan)
            // $table->foreign('lembaga_id')->references('id')->on('lembaga')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Menghapus tabel activity_logs
        Schema::dropIfExists('activity_logs');
    }
};