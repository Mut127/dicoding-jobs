<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacancyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'position' => $this->position,
            'employment_type' => $this->employment_type,
            'candidates_needed' => $this->candidates_needed,
            'active_until' => $this->active_until->toDateString(),
            'location' => $this->location,
            'is_remote' => $this->is_remote,
            'description' => $this->description,
            'show_salary' => $this->show_salary,
            'salary_min' => $this->show_salary ? $this->salary_min : null,
            'salary_max' => $this->show_salary ? $this->salary_max : null,
            'min_experience' => $this->min_experience,
            'created_at' => $this->created_at->toIso8601String(),
            'company' => $this->whenLoaded('company', fn () => [
                'id' => $this->company->id,
                'name' => $this->company->name,
                'business_sector' => $this->company->business_sector,
                'employee_range' => $this->company->employee_range,
                'city' => $this->company->city,
            ]),
        ];
    }
}