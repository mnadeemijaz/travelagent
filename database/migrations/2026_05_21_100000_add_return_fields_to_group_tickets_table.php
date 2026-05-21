<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('group_tickets', function (Blueprint $table) {
            $table->boolean('is_return')->default(false)->after('is_active');
            $table->date('ret_dep_date')->nullable()->after('is_return');
            $table->time('ret_dep_time')->nullable()->after('ret_dep_date');
            $table->time('ret_arr_time')->nullable()->after('ret_dep_time');
            $table->string('ret_flight_no', 30)->nullable()->after('ret_arr_time');
        });
    }

    public function down(): void
    {
        Schema::table('group_tickets', function (Blueprint $table) {
            $table->dropColumn(['is_return', 'ret_dep_date', 'ret_dep_time', 'ret_arr_time', 'ret_flight_no']);
        });
    }
};
