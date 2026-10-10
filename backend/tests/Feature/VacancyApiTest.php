<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'company_id' => Company::factory()->create()->id,
            'title' => 'Product Engineer',
            'position' => 'Backend Developer',
            'employment_type' => 'full_time',
            'candidates_needed' => 1,
            'active_until' => now()->addMonth()->toDateString(),
            'location' => 'Bandung',
            'is_remote' => false,
            'description' => 'Build great products.',
            'salary_min' => 5000000,
            'salary_max' => 8000000,
            'show_salary' => true,
            'min_experience' => '1_3',
        ], $overrides);
    }

    public function test_can_create_vacancy(): void
    {
        $response = $this->postJson('/api/vacancies', $this->validPayload());

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Product Engineer');
        $this->assertDatabaseHas('vacancies', ['title' => 'Product Engineer']);
    }

    public function test_create_vacancy_requires_title(): void
    {
        $this->postJson('/api/vacancies', $this->validPayload(['title' => null]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_create_vacancy_rejects_invalid_employment_type(): void
    {
        $this->postJson('/api/vacancies', $this->validPayload(['employment_type' => 'abc']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('employment_type');
    }

    public function test_can_list_vacancies(): void
    {
        Vacancy::factory()->count(3)->create();

        $this->getJson('/api/vacancies')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_search_vacancies_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->create(['title' => 'Code Reviewer']);

        $this->getJson('/api/vacancies?search=Developer')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Android Developer');
    }

    public function test_can_show_vacancy_detail(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->getJson("/api/vacancies/{$vacancy->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $vacancy->id);
    }

    public function test_show_returns_404_when_not_found(): void
    {
        $this->getJson('/api/vacancies/9999')->assertNotFound();
    }

        public function test_can_update_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create(['title' => 'Old Title']);

        $this->putJson("/api/vacancies/{$vacancy->id}", $this->validPayload([
            'company_id' => $vacancy->company_id,
            'title' => 'New Title',
        ]))
            ->assertOk()
            ->assertJsonPath('data.title', 'New Title');

        $this->assertDatabaseHas('vacancies', ['id' => $vacancy->id, 'title' => 'New Title']);
    }

    public function test_update_vacancy_validates_input(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->putJson("/api/vacancies/{$vacancy->id}", $this->validPayload(['title' => null]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_update_returns_404_when_not_found(): void
    {
        $this->putJson('/api/vacancies/9999', $this->validPayload())->assertNotFound();
    }

    public function test_can_delete_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $this->deleteJson("/api/vacancies/{$vacancy->id}")->assertNoContent();

        $this->assertDatabaseMissing('vacancies', ['id' => $vacancy->id]);
    }

    public function test_delete_returns_404_when_not_found(): void
    {
        $this->deleteJson('/api/vacancies/9999')->assertNotFound();
    }
}