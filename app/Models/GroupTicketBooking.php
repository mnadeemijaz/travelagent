<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupTicketBooking extends Model
{
    protected $fillable = [
        'group_ticket_id', 'user_id', 'passengers',
        'contact_phone', 'notes', 'status',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(GroupTicket::class, 'group_ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
