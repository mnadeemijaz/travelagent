<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class VoucherClient extends Model {
    protected $table    = 'voucher_clients';
    protected $fillable = ['voucher_id', 'client_id', 'document_fee'];
    protected $casts    = ['document_fee' => 'decimal:2'];
    public function voucher() { return $this->belongsTo(Voucher::class); }
    public function client()  { return $this->belongsTo(Client::class); }
}