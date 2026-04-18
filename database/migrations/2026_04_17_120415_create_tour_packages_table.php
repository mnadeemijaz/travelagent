<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('tour_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('tour_packages'); }
};