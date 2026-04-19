<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankTransection extends Model
{
    protected $table = 'bank_transection';

    protected $fillable = [
        'payment_type', 'amount', 'date', 'detail',
        'isDeleted', 'bank_id', 'agent_id',
    ];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}
