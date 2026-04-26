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
