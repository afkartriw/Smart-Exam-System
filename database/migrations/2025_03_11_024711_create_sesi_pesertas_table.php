<?php



use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSesiPesertasTable extends Migration
{
    public function up()
    {
        Schema::create('sesi_pesertas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_id')->constrained('sesi_ujians')->onDelete('cascade');
            $table->foreignId('peserta_id')->constrained('pesertas')->onDelete('cascade');
            $table->enum('status', ['aktif', 'non_aktif'])->default('aktif');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sesi_pesertas');
    }
}
