<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('vouchers', function (Blueprint $table) {
            $table->time('dep_time')->nullable()->after('dep_date');
            $table->date('arv_date')->nullable()->after('dep_time');
            $table->time('arv_time')->nullable()->after('arv_date');
            $table->time('ret_time')->nullable()->after('ret_date');
            $table->string('ret_sector1', 100)->nullable()->after('dep_sector2');
            $table->string('ret_sector2', 100)->nullable()->after('ret_sector1');
            $table->string('dep_flight_no', 50)->nullable()->after('dep_flight');
            $table->string('dep_pnr_no', 50)->nullable()->after('dep_flight_no');
            $table->string('ret_flight_no', 50)->nullable()->after('ret_flight');
            $table->string('ret_pnr_no', 50)->nullable()->after('ret_flight_no');
            $table->unsignedBigInteger('vehicle_id')->nullable()->after('ret_pnr_no');
            $table->unsignedBigInteger('trip_id')->nullable()->after('vehicle_id');
            $table->unsignedBigInteger('pkg_type')->nullable()->after('trip_id');
            $table->integer('total_nights')->default(0)->after('pkg_type');
            $table->text('remarks')->nullable()->after('total_nights');
            $table->string('contact', 50)->nullable()->after('remarks');
            $table->string('gp_hd_no', 30)->nullable()->after('contact');
            $table->decimal('total', 12, 2)->default(0)->after('gp_hd_no');
            $table->integer('t_adult')->default(0)->after('total');
            $table->integer('t_child')->default(0)->after('t_adult');
            $table->integer('t_infant')->default(0)->after('t_child');
        });
    }
    public function down(): void {
        Schema::table('vouchers', function (Blueprint $table) {
            $table->dropColumn([
                'dep_time','arv_date','arv_time','ret_time',
                'ret_sector1','ret_sector2',
                'dep_flight_no','dep_pnr_no','ret_flight_no','ret_pnr_no',
                'vehicle_id','trip_id','pkg_type','total_nights',
                'remarks','contact','gp_hd_no','total','t_adult','t_child','t_infant',
            ]);
        });
    }
};
