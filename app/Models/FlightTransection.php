<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class FlightTransection extends Model
{
    protected $table = 'flight_transection';

    protected $fillable = [
        'flight_id', 'amount', 'payment_type',
        'isDeleted', 'date', 'detail', 'bank_id',
    ];

    public function flight(): BelongsTo
    {
        return $this->belongsTo(Flight::class);
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }
}
