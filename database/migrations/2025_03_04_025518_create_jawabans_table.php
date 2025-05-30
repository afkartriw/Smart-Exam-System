<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('jawabans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('soal_id')->constrained('soals')->onDelete('cascade');
            $table->string('jawaban_teks');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('jawabans');
    }
};
