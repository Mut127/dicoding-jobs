<?php

namespace Tests\Unit;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_scope_filters_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'iOS Developer']);
        Vacancy::factory()->create(['title' => 'Product Engineer']);

        $this->assertCount(1, Vacancy::search('Engineer')->get());
    }

    public function test_search_scope_returns_all_when_term_is_empty(): void
    {
        Vacancy::factory()->count(2)->create();

        $this->assertCount(2, Vacancy::search(null)->get());
    }
}