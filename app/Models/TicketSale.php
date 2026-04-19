<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketSale extends Model
{
    protected $table = 'ticket_sale';

    protected $fillable = [
        'date', 'name', 'phone', 'ticket_no', 'pnr',
        'flight_id', 'agent_id', 'ticket_from_to', 'category',
        'purchase', 'sale', 'bps_sale', 'isDeleted',
        'payment_status', 'paid_amount',
    ];

    public function flight(): BelongsTo
    {
        return $this->belongsTo(Flight::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function getProfitAttribute(): int
    {
        return (int) $this->sale - (int) $this->purchase;
    }
}
