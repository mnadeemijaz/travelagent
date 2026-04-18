<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_id')->nullable()->index();
            $table->date('date')->nullable();
            $table->date('dep_date')->nullable();
            $table->date('ret_date')->nullable();
            $table->unsignedBigInteger('dep_flight')->nullable();
            $table->unsignedBigInteger('ret_flight')->nullable();
            $table->string('dep_sector1', 100)->nullable();
            $table->string('dep_sector2', 100)->nullable();
            $table->decimal('adult_rate', 10, 2)->default(0);
            $table->decimal('child_rate', 10, 2)->default(0);
            $table->decimal('infant_rate', 10, 2)->default(0);
            $table->decimal('sr_rate', 10, 2)->default(0);
            $table->tinyInteger('approved')->default(0);
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
            $table->foreign('agent_id')->references('id')->on('users');
            $table->foreign('dep_flight')->references('id')->on('flights');
            $table->foreign('ret_flight')->references('id')->on('flights');
        });
    }
    public function down(): void { Schema::dropIfExists('vouchers'); }
};