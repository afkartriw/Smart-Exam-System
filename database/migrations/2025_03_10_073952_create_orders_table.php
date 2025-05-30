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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('status');
            $table->string('uname');
            $table->string('email');
            $table->string('number');
            $table->string('transaction_id');
            $table->string('order_id');
            $table->string('gross_amount');
            $table->string('payment_type');
            $table->string('payment_code')->nullable();
            $table->string('pdf_url')->nullable();
            $table->unsignedBigInteger('lembaga_id'); // Tambahkan kolom lembaga_id
            $table->foreign('lembaga_id')->references('id')->on('lembagas')->onDelete('cascade'); // Definisikan foreign key
            $table->unsignedBigInteger('poin_id'); // Tambahkan kolom poin_id
            $table->foreign('poin_id')->references('id')->on('poins')->onDelete('cascade'); // Relasikan ke tabel poins
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        if (Schema::hasColumn('orders', 'poin_id')) {
            $table->dropForeign(['poin_id']);
            $table->dropColumn('poin_id');
        }
    });
    
    Schema::dropIfExists('orders');
}

};