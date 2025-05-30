<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('streamings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_peserta_id')->constrained('sesi_pesertas')->onDelete('cascade');
            $table->string('stream_url'); // URL streaming mahasiswa
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('streamings');
    }
};
