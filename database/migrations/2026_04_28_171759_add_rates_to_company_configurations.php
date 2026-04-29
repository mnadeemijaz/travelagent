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
        Schema::table('company_configurations', function (Blueprint $table) {
            $table->decimal('adult_rate',  10, 2)->default(0)->after('email');
            $table->decimal('child_rate',  10, 2)->default(0)->after('adult_rate');
            $table->decimal('infant_rate', 10, 2)->default(0)->after('child_rate');
            $table->decimal('sr_rate',     10, 4)->default(1)->after('infant_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_configurations', function (Blueprint $table) {
            $table->dropColumn(['adult_rate','child_rate','infant_rate','sr_rate']);
        });
    }
};
