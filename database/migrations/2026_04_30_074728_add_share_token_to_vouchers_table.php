<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vouchers', function (Blueprint $table) {
            $table->string('share_token', 64)->nullable()->unique()->after('id');
        });

        // Backfill tokens for existing vouchers
        DB::table('vouchers')->whereNull('share_token')->orderBy('id')->each(function ($v) {
            DB::table('vouchers')->where('id', $v->id)->update(['share_token' => Str::random(64)]);
        });
    }

    public function down(): void
    {
        Schema::table('vouchers', function (Blueprint $table) {
            $table->dropColumn('share_token');
        });
    }
};
