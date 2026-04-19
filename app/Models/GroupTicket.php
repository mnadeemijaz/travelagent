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
    ];

    protected $casts = [
        'dep_date'   => 'date',
        'is_active'  => 'boolean',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(GroupTicketBooking::class);
    }
}
