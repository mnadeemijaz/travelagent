<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('category', 50);          // umrah, visit, hajj, etc.
            $table->string('airline', 100);
            $table->string('from_city', 100);
            $table->string('to_city', 100);
            $table->string('booking_code', 50)->nullable();
            $table->date('dep_date');
            $table->time('dep_time');
            $table->time('arr_time');
            $table->string('flight_no', 30)->nullable();
            $table->enum('meal', ['yes', 'no'])->default('no');
            $table->string('baggage', 50)->nullable();   // e.g. "23+7 KG"
            $table->integer('price');
            $table->integer('seats_available')->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('isDeleted')->default(0);
            $table->timestamps();
        });

        Schema::create('group_ticket_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_ticket_id')->constrained('group_tickets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('passengers')->default(1);
            $table->string('contact_phone', 30)->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_ticket_bookings');
        Schema::dropIfExists('group_tickets');
    }
};
