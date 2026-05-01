<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Voucher extends Model {
    protected $fillable = [
        'agent_id','date','dep_date','dep_time','arv_date','arv_time',
        'ret_date','ret_time','dep_flight','dep_flight_no','dep_pnr_no',
        'ret_flight','ret_flight_no','ret_pnr_no',
        'dep_sector1','dep_sector2','ret_sector1','ret_sector2',
        'vehicle_id','trip_id','pkg_type','total_nights',
        'adult_rate','child_rate','infant_rate','sr_rate',
        'total','t_adult','t_child','t_infant',
        'remarks','contact','gp_hd_no',
        'approved','isDeleted','share_token',
    ];

    protected static function booted(): void
    {
        static::creating(function (Voucher $voucher) {
            $voucher->share_token = Str::random(64);
        });
    }
    protected $casts = [
        'date'     => 'date',
        'dep_date' => 'date',
        'arv_date' => 'date',
        'ret_date' => 'date',
    ];
    public function agent()           { return $this->belongsTo(User::class, 'agent_id'); }
    public function departureFlight() { return $this->belongsTo(Flight::class, 'dep_flight'); }
    public function returnFlight()    { return $this->belongsTo(Flight::class, 'ret_flight'); }
    public function vehicle()         { return $this->belongsTo(Vehicle::class); }
    public function trip()            { return $this->belongsTo(Trip::class); }
    public function tourPackage()     { return $this->belongsTo(TourPackage::class, 'pkg_type'); }
    public function clients()         { return $this->belongsToMany(Client::class, 'voucher_clients', 'voucher_id', 'client_id')->withPivot('document_fee'); }
    public function hotels()          { return $this->hasMany(VoucherHotel::class); }
    public function transactions()    { return $this->hasMany(Transaction::class, 'voucher_id'); }
    public function ziarats()         { return $this->belongsToMany(Ziarat::class, 'voucher_ziarats'); }
}
