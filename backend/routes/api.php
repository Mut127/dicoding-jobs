<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VacancyController;



Route::apiResource('vacancies', VacancyController::class);
