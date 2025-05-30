<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('paket_soals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lembaga_id')->constrained('lembagas')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('materi');
            $table->integer('skala_nilai');
            $table->integer('kkm');
            $table->boolean('acak_soal')->default(false);
            $table->boolean('acak_jawaban')->default(false);
            $table->text('petunjuk_pengerjaan');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('paket_soals');
    }
};
