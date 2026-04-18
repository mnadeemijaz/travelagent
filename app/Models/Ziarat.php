<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Ziarat extends Model {
    protected $fillable = ['name', 'amount', 'isDeleted'];
    protected $casts    = ['amount' => 'decimal:2'];
}