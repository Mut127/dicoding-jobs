<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateVacancyRequest;

class VacancyController extends Controller
{
    public function index(Request $request)
    {
        $vacancies = Vacancy::with('company')
            ->search($request->query('search'))
            ->latest()
            ->get();

        return VacancyResource::collection($vacancies);
    }

    public function store(StoreVacancyRequest $request)
    {
        $vacancy = Vacancy::create($request->validated());

        return new VacancyResource($vacancy->load('company'));
    }

    public function show(Vacancy $vacancy)
    {
        return new VacancyResource($vacancy->load('company'));
    }

        public function update(UpdateVacancyRequest $request, Vacancy $vacancy)
    {
        $vacancy->update($request->validated());

        return new VacancyResource($vacancy->load('company'));
    }

    public function destroy(Vacancy $vacancy)
    {
        $vacancy->delete();

        return response()->noContent();
    }
}