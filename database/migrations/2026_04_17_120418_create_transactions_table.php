<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id')->index();
            $table->string('account_type', 20)->default('agent');
            $table->enum('payment_type', ['dr','cr']);
            $table->date('date');
            $table->text('detail')->nullable();
            $table->decimal('amount', 12, 2)->default(0);
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
            $table->foreign('account_id')->references('id')->on('users');
            // voucher_id FK added after vouchers table in a separate migration
        });
    }
    public function down(): void { Schema::dropIfExists('transactions'); }
};