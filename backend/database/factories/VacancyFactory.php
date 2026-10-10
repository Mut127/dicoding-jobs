<?php

namespace Database\Factories;

use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

/**
 * @extends Factory<Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'title' => fake()->jobTitle(),
            'position' => fake()->randomElement(['Backend Developer', 'Frontend Developer', 'Product Engineer']),
            'employment_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'internship']),
            'candidates_needed' => fake()->numberBetween(1, 5),
            'active_until' => now()->addMonth()->toDateString(),
            'location' => 'Bandung',
            'is_remote' => false,
            'description' => fake()->paragraphs(2, true),
            'salary_min' => 5000000,
            'salary_max' => 8000000,
            'show_salary' => true,
            'min_experience' => fake()->randomElement(['less_than_1', '1_3', '4_5']),
        ];
    }
}
