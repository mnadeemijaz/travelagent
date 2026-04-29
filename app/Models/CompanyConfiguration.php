<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyConfiguration extends Model
{
    protected $fillable = [
        'company_name',
        'address',
        'tagline',
        'phone',
        'email',
        'adult_rate',
        'child_rate',
        'infant_rate',
        'sr_rate',
    ];

    protected $casts = [
        'adult_rate'  => 'decimal:2',
        'child_rate'  => 'decimal:2',
        'infant_rate' => 'decimal:2',
        'sr_rate'     => 'decimal:4',
    ];

    /**
     * Always returns the single configuration row (creates it if missing).
     */
    public static function instance(): static
    {
        return static::firstOrCreate([], [
            'company_name' => '',
            'address'      => '',
            'tagline'      => '',
            'phone'        => '',
            'email'        => '',
        ]);
    }
}
