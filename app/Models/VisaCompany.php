<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class VisaCompany extends Model {
    protected $fillable = ['name', 'isDeleted'];
    public function clients() { return $this->hasMany(Client::class, 'visa_company_id'); }
}