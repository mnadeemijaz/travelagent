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
        Schema::create('flight_transection', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('flight_id')->nullable();
            $table->unsignedBigInteger('ts_id');          // ticket_sale id
            $table->integer('amount');
            $table->enum('payment_type', ['cr', 'dr']);
            $table->integer('isDeleted')->default(0);
            $table->date('date');
            $table->string('detail', 100);
            $table->unsignedBigInteger('bank_id')->nullable();
            $table->timestamps();

            $table->foreign('flight_id')->references('id')->on('flights')->onDelete('set null');
            $table->foreign('ts_id')->references('id')->on('ticket_sale')->onDelete('cascade');
            $table->foreign('bank_id')->references('id')->on('banks')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flight_transection');
    }
};
