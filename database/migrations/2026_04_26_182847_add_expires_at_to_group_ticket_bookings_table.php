<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_ticket_bookings', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('status');
        });

        // Extend status enum to include 'cancelled'
        DB::statement("ALTER TABLE group_ticket_bookings MODIFY COLUMN status ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('group_ticket_bookings', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });

        DB::statement("ALTER TABLE group_ticket_bookings MODIFY COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");
    }
};
