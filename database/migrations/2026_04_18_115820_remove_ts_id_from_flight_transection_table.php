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
        Schema::table('flight_transection', function (Blueprint $table) {
            $table->dropForeign(['ts_id']);
            $table->dropColumn('ts_id');
        });
    }

    public function down(): void
    {
        Schema::table('flight_transection', function (Blueprint $table) {
            $table->unsignedBigInteger('ts_id')->after('flight_id');
            $table->foreign('ts_id')->references('id')->on('ticket_sale')->onDelete('cascade');
        });
    }
};
