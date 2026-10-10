<?php

namespace App\Http\Requests;

class UpdateVacancyRequest extends StoreVacancyRequest
{
    public function rules(): array
    {
        $rules = parent::rules();
        // Lowongan lama boleh diedit meski tanggal aktifnya udah lewat
        $rules['active_until'] = ['required', 'date'];

        return $rules;
    }
}