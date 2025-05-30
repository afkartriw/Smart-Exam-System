<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lembaga_id')->constrained('lembagas')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nama_staff')->nullable();
            $table->string('email')->unique();
            $table->timestamps();

            // New attributes
            $table->enum('peserta', ['aktif', 'tidak_aktif'])->default('aktif');
            $table->enum('paket_soal', ['aktif', 'tidak_aktif'])->default('aktif');
            $table->enum('sesi', ['aktif', 'tidak_aktif'])->default('aktif');
            $table->enum('pengawas', ['aktif', 'tidak_aktif'])->default('aktif');
            
            // Add photo column
            $table->string('photo')->nullable();  // This will store the file path or URL
        });
    }

    public function down()
    {
        Schema::dropIfExists('staff');
    }
};
