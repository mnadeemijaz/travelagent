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
        Schema::table('agent_hotels', function (Blueprint $table) {
            $table->string('room_type', 50)->default('sharing')->after('hotel_id');
            $table->unique(['agent_id', 'hotel_id', 'room_type'], 'agent_hotel_room_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agent_hotels', function (Blueprint $table) {
            $table->dropUnique('agent_hotel_room_unique');
            $table->dropColumn('room_type');
        });
    }
};
