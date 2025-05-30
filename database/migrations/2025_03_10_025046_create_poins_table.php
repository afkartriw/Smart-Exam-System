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
        Schema::create('poins', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Add column for 'nama'
            $table->integer('jumlah_poin'); // Add column for 'jumlah_poin'
            $table->integer('harga'); // Add column for 'harga' with 2 decimal precision
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poins');
    }
};
