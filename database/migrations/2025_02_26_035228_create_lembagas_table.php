<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lembagas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lembaga');
            $table->string('alamat');
            $table->string('kabupaten');
            $table->enum('jenis', ['SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'Perguruan Tinggi', 'Perusahaan']);
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('whatsapp');
            $table->string('nama_lengkap');
            $table->unsignedBigInteger('user_id'); // Add user_id column
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Foreign key for user_id
            $table->unsignedBigInteger('poin')->default(0); // Add poin column with default 0
            $table->timestamps();
            $table->string('logo')->nullable(); // Add logo column that can be null
        });
    }

    public function down(): void {
        Schema::dropIfExists('lembagas'); // Drop the entire table, including the logo column
    }
};
