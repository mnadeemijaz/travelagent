<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Transaction extends Model {
    protected $fillable = [
        'account_id','account_type','payment_type',
        'date','detail','amount','voucher_id','isDeleted',
    ];
    protected $casts = [
        'date'   => 'date',
        'amount' => 'decimal:2',
    ];
    public function agent()   { return $this->belongsTo(User::class, 'account_id'); }
    public function voucher() { return $this->belongsTo(Voucher::class, 'voucher_id'); }
}