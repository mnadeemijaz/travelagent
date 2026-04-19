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
        Schema::create('ticket_sale', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name', 120);
            $table->string('phone', 100)->nullable();
            $table->string('ticket_no', 100);
            $table->string('pnr', 100);
            $table->unsignedBigInteger('flight_id');
            $table->unsignedBigInteger('agent_id');
            $table->string('ticket_from_to', 120);
            $table->string('category', 110);
            $table->integer('purchase');
            $table->integer('sale');
            $table->enum('bps_sale', ['no', 'yes'])->default('no');
            $table->integer('isDeleted')->default(0);
            $table->enum('payment_status', ['partial', 'full'])->nullable();
            $table->integer('paid_amount')->nullable();
            $table->timestamps();

            $table->foreign('flight_id')->references('id')->on('flights')->onDelete('cascade');
            $table->foreign('agent_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_sale');
    }
};
