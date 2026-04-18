<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class VoucherHotel extends Model {
    protected $fillable = ['voucher_id','city_name','city_nights','check_in','check_out','hotel_id','room_type'];
    protected $casts = ['check_in' => 'date', 'check_out' => 'date'];
    public function hotel() { return $this->belongsTo(Hotel::class); }
    public function voucher() { return $this->belongsTo(Voucher::class); }
}
