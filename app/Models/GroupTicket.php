<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupTicket extends Model
{
    protected $fillable = [
        'category', 'airline', 'from_city', 'to_city', 'booking_code',
        'dep_date', 'dep_time', 'arr_time', 'flight_no',
        'meal', 'baggage', 'price', 'seats_available', 'is_active', 'isDeleted',
        'is_return', 'ret_dep_date', 'ret_dep_time', 'ret_arr_time', 'ret_flight_no',
    ];

    protected $casts = [
        'dep_date'     => 'date',
        'ret_dep_date' => 'date',
        'is_active'    => 'boolean',
        'is_return'    => 'boolean',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(GroupTicketBooking::class);
    }
}
