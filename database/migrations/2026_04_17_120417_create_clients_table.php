<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('sr_name', 128)->nullable();
            $table->string('name', 128);
            $table->string('last_name', 128)->nullable();
            $table->string('cnic', 20)->nullable();
            $table->string('address', 255)->nullable();
            $table->date('dob')->nullable();
            $table->date('passport_issue_date')->nullable();
            $table->date('passport_exp_date')->nullable();
            $table->string('ppno', 50)->nullable()->index();
            $table->enum('age_group', ['adult','child','infant'])->default('adult');
            $table->unsignedBigInteger('agent_id')->nullable()->index();
            $table->unsignedBigInteger('visa_company_id')->nullable();
            $table->string('visa_id', 50)->nullable();
            $table->string('visa_no', 50)->nullable();
            $table->date('visa_date')->nullable();
            $table->enum('visa_approve', ['yes','no'])->default('no');
            $table->enum('voucher_issue', ['yes','no'])->default('no');
            $table->enum('document', ['yes','no'])->default('no');
            $table->string('account_pkg', 128)->nullable();
            $table->string('group_code', 50)->nullable();
            $table->string('group_name', 128)->nullable();
            $table->string('iata', 50)->nullable();
            $table->tinyInteger('isDeleted')->default(0);
            $table->timestamps();
            $table->foreign('agent_id')->references('id')->on('users');
            $table->foreign('visa_company_id')->references('id')->on('visa_companies');
        });
    }
    public function down(): void { Schema::dropIfExists('clients'); }
};