<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('hasil_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peserta_id')->constrained('pesertas')->onDelete('cascade');
            $table->integer('total_skor')->nullable();
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('hasil_ujians');
    }
};
