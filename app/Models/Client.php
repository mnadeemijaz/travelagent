<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Client extends Model {
    protected $fillable = [
        'sr_name','name','last_name','cnic','address','dob',
        'passport_issue_date','passport_exp_date','ppno','age_group',
        'agent_id','visa_company_id','visa_id','visa_no','visa_date',
        'visa_approve','voucher_issue','document','account_pkg',
        'group_code','group_name','iata','isDeleted',
    ];
    protected $casts = [
        'dob'                  => 'date',
        'passport_issue_date'  => 'date',
        'passport_exp_date'    => 'date',
        'visa_date'            => 'date',
    ];
    public function agent()       { return $this->belongsTo(User::class, 'agent_id'); }
    public function visaCompany() { return $this->belongsTo(VisaCompany::class, 'visa_company_id'); }
    public function vouchers()    { return $this->belongsToMany(Voucher::class, 'voucher_clients', 'client_id', 'voucher_id')->withPivot('document_fee'); }
}