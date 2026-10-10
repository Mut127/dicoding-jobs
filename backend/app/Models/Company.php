<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'business_sector', 'employee_range', 'city'];

    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }
}