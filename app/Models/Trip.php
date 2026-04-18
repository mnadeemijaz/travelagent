<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Trip extends Model {
    protected $fillable = ['name', 'vehicle_id', 'price', 'isDeleted'];
    protected $casts    = ['price' => 'decimal:2'];
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
}