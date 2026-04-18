<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->string('city_name', 100);
            $table->string('room_type', 50);
            $table->string('pkg_type', 50)->nullable();
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('hotels'); }
};