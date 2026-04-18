<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('voucher_hotels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voucher_id')->index();
            $table->string('city_name', 50)->nullable();
            $table->integer('city_nights')->default(0);
            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->unsignedBigInteger('hotel_id')->nullable();
            $table->string('room_type', 30)->nullable();
            $table->timestamps();
            $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('cascade');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('set null');
        });
    }
    public function down(): void { Schema::dropIfExists('voucher_hotels'); }
};
