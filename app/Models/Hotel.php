<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Hotel extends Model {
    protected $fillable = ['name', 'city_name', 'room_type', 'pkg_type', 'isDeleted'];
}