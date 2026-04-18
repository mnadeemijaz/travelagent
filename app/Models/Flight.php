<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Flight extends Model {
    protected $fillable = ['name', 'bsp', 'isDeleted'];
    public function departureVouchers() { return $this->hasMany(Voucher::class, 'dep_flight'); }
    public function returnVouchers()    { return $this->hasMany(Voucher::class, 'ret_flight'); }
}