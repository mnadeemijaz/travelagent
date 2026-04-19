<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_transection', function (Blueprint $table) {
            $table->id();
            $table->enum('payment_type', ['cr', 'dr']);
            $table->integer('amount');
            $table->date('date');
            $table->string('detail', 100);
            $table->integer('isDeleted')->default(0);
            $table->unsignedBigInteger('bank_id');
            $table->unsignedBigInteger('agent_id');
            $table->foreign('bank_id')->references('id')->on('banks')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_transection');
    }
};
