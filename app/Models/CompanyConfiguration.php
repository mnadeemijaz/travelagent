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
        'makkah_contact1_name',
        'makkah_contact1_phone',
        'makkah_contact2_name',
        'makkah_contact2_phone',
        'madina_contact1_name',
        'madina_contact1_phone',
        'madina_contact2_name',
        'madina_contact2_phone',
        'contact_name',
        'contact_phone',
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
            'contact_name' => '',
            'contact_phone' => '',
        ]);
    }
}
