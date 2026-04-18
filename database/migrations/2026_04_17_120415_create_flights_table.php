<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('flights', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->string('bsp', 50)->nullable();
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('flights'); }
};