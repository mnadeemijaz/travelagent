<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Vehicle extends Model {
    protected $fillable = ['name', 'sharing', 'isDeleted'];
    public function trips() { return $this->hasMany(Trip::class); }
}