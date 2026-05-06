<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('group_ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->timestamps();
        });

        // Seed with existing hardcoded categories
        DB::table('group_ticket_categories')->insert(
            array_map(fn($name) => ['name' => $name, 'created_at' => now(), 'updated_at' => now()],
                ['umrah', 'visit', 'hajj', 'tour', 'other'])
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_ticket_categories');
    }
};
