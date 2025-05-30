<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('activity_logs', function (Blueprint $table) {
        $table->unsignedBigInteger('lembaga_id')->nullable()->after('user_id'); // Tambahkan kolom lembaga_id
        $table->foreign('lembaga_id')->references('id')->on('lembagas')->onDelete('set null'); // Foreign key ke tabel lembagas
    });
}

public function down()
{
    Schema::table('activity_logs', function (Blueprint $table) {
        $table->dropForeign(['lembaga_id']); // Hapus foreign key
        $table->dropColumn('lembaga_id'); // Hapus kolom lembaga_id
    });
}
};
