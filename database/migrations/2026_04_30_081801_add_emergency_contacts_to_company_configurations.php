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
            $table->string('makkah_contact1_name',  100)->nullable()->after('sr_rate');
            $table->string('makkah_contact1_phone',  50)->nullable()->after('makkah_contact1_name');
            $table->string('makkah_contact2_name',  100)->nullable()->after('makkah_contact1_phone');
            $table->string('makkah_contact2_phone',  50)->nullable()->after('makkah_contact2_name');
            $table->string('madina_contact1_name',  100)->nullable()->after('makkah_contact2_phone');
            $table->string('madina_contact1_phone',  50)->nullable()->after('madina_contact1_name');
            $table->string('madina_contact2_name',  100)->nullable()->after('madina_contact1_phone');
            $table->string('madina_contact2_phone',  50)->nullable()->after('madina_contact2_name');
        });
    }

    public function down(): void
    {
        Schema::table('company_configurations', function (Blueprint $table) {
            $table->dropColumn([
                'makkah_contact1_name', 'makkah_contact1_phone',
                'makkah_contact2_name', 'makkah_contact2_phone',
                'madina_contact1_name', 'madina_contact1_phone',
                'madina_contact2_name', 'madina_contact2_phone',
            ]);
        });
    }
};
