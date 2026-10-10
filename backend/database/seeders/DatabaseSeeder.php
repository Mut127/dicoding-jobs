<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::create([
            'name' => 'Dicoding Indonesia',
            'business_sector' => 'Technology',
            'employee_range' => '50-100',
            'city' => 'Bandung',
        ]);

        $vacancies = [
            ['title' => 'Product Engineer', 'min_experience' => '1_3'],
            ['title' => 'Android Developer', 'min_experience' => '4_5'],
            ['title' => 'iOS Developer', 'min_experience' => '1_3'],
            ['title' => 'Code Reviewer', 'min_experience' => 'less_than_1'],
        ];

        foreach ($vacancies as $data) {
            Vacancy::factory()->for($company)->create($data + [
                'position' => $data['title'],
                'employment_type' => 'full_time',
                'location' => 'Bandung',
            ]);
        }
    }
}