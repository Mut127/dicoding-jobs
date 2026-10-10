# Dicoding Jobs: Job Vacancy System

A simple job vacancy system built for the Dicoding Product Engineer Intern technical test.
Recruiters can create, edit, and delete vacancies, and job seekers can browse and search vacancies by title.

- **Backend:** Laravel (PHP), RESTful API
- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS, TanStack Query)
- **Database:** MySQL
- **Testing:** PHPUnit (unit + integration) and Playwright (end-to-end)

## Features

**User stories**

- As a Recruiter, I can create a new vacancy so it is listed on the platform.
- As a Job Seeker, I can search for jobs by title.

**Backend (Laravel)**

- `POST /api/vacancies` create a vacancy (mandatory)
- `GET /api/vacancies` list vacancies, with optional `?search=` filter by title (mandatory)
- `GET /api/vacancies/{id}` vacancy detail (mandatory)
- `PUT /api/vacancies/{id}` update a vacancy (optional)
- `DELETE /api/vacancies/{id}` delete a vacancy (optional)
- Request validation with a Form Request, JSON formatting with an API Resource, and a seeder with sample data

**Frontend (Next.js)**

- Vacancy list page with debounced search by title (`/`)
- Vacancy detail page (`/vacancies/[id]`)
- Dashboard with Edit and Delete actions (`/dashboard`)
- Create and edit vacancy forms (`/vacancies/new`, `/vacancies/[id]/edit`), sharing one reusable form component
- Reusable `JobCard` component, styled with Tailwind CSS to follow the Figma design
- Data fetching and caching with TanStack Query

## Project structure

```
dicoding-jobs/
├── backend/     Laravel API (app, database, routes, tests)
├── frontend/    Next.js app (app, components, lib, e2e)
└── README.md
```

## Prerequisites

- PHP 8.3 or newer (required by Laravel 13) and Composer
- MySQL 8 (or MariaDB). Laragon, XAMPP, or any local MySQL works
- Node.js 20.9 or newer and npm

## Setup and run

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env        # on Windows cmd: copy .env.example .env
php artisan key:generate
```

Create two empty MySQL databases:

- `dicoding_jobs` (application data)
- `dicoding_jobs_test` (used only by the automated tests)

Then edit `backend/.env` so the database section looks like this (adjust the credentials to your MySQL setup):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dicoding_jobs
DB_USERNAME=root
DB_PASSWORD=
```

Run the migrations, seed the sample data, and start the server:

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

The API is now available at `http://127.0.0.1:8000/api/vacancies`.

> The seeder creates the company "Dicoding Indonesia" (id `1`) and four sample vacancies. The frontend create form and the E2E tests rely on company id `1`, so run the seeder before using them.

### 2. Frontend (Next.js)

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:3000**. Use `localhost`, not `127.0.0.1`, because the backend CORS configuration allows `http://localhost:3000`. If you need another origin, update `allowed_origins` in `backend/config/cors.php`.

## Running the tests

### Backend: unit and integration tests

Make sure MySQL is running and the `dicoding_jobs_test` database exists. `backend/phpunit.xml` points the tests to that database, so your application data is never touched.

```bash
cd backend
php artisan test                      # all tests
php artisan test --testsuite=Unit     # unit tests only
php artisan test --testsuite=Feature  # integration (API) tests only
```

- **Unit tests** (`tests/Unit/VacancyTest.php`): the `search` scope of the `Vacancy` model.
- **Integration tests** (`tests/Feature/VacancyApiTest.php`): every API endpoint against a real database, including validation errors and 404 responses.

### Frontend: end-to-end tests (Playwright)

```bash
cd frontend
npx playwright install chromium   # first time only
npm run test:e2e
```

The Playwright config starts the backend (`php artisan serve`) and the frontend (`npm run dev`) automatically if they are not already running, so the database must be migrated and seeded first (see the backend setup above).

The E2E suite covers the three required scenarios:

1. User opens the vacancies list page
2. User searches a job by title
3. User views vacancy details

The tests create their own uniquely named vacancy through the API before running and delete it afterwards, so they do not depend on or pollute the seeded data. Optional commands:

```bash
npm run test:e2e:ui        # interactive UI mode
npx playwright show-report # open the last HTML report
```

## API reference

Base URL: `http://127.0.0.1:8000/api`. Send `Accept: application/json` (and `Content-Type: application/json` for request bodies).

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/vacancies` | List vacancies. Optional query `search` filters by title | `200` |
| POST | `/vacancies` | Create a vacancy | `201` |
| GET | `/vacancies/{id}` | Vacancy detail | `200` |
| PUT | `/vacancies/{id}` | Update a vacancy | `200` |
| DELETE | `/vacancies/{id}` | Delete a vacancy | `204` |

Validation errors return `422` with field-level messages. An unknown id returns `404`.

**Create / update body**

| Field | Rules |
|---|---|
| `company_id` | required, must exist in `companies` |
| `title` | required, string, max 255 |
| `position` | required, string, max 255 |
| `employment_type` | required, one of `full_time`, `part_time`, `contract`, `internship` |
| `candidates_needed` | required, integer, min 1 |
| `active_until` | required, date (on create it must be today or later) |
| `location` | required, string, max 255 |
| `is_remote` | optional, boolean |
| `description` | required, string |
| `salary_min`, `salary_max` | optional, integers (`salary_max` must be greater than or equal to `salary_min`) |
| `show_salary` | optional, boolean |
| `min_experience` | required, one of `less_than_1`, `1_3`, `4_5`, `6_10`, `more_than_10` |

**Example**

```bash
curl -X POST http://127.0.0.1:8000/api/vacancies \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "title": "Product Engineer",
    "position": "Backend Developer",
    "employment_type": "full_time",
    "candidates_needed": 1,
    "active_until": "2026-12-31",
    "location": "Bandung",
    "description": "Build great products.",
    "min_experience": "1_3"
  }'
```

## Design decisions

- **Separate `companies` table.** The company name, business sector, and employee range appear in the Figma design but are not part of the vacancy form, so they are stored in their own table and linked to vacancies by a foreign key.
- **Default company for recruiters.** The task has no authentication requirement, so the create form uses the seeded company (id `1`) instead of a login flow.
- **Salary visibility.** The API only returns salary values when `show_salary` is enabled, matching the "Tampilkan gaji" toggle in the design.
- **Search in the backend.** The title filter is a query scope on the model, used by the list endpoint and covered by a unit test.
- **Plain textarea for the description.** The Figma design shows a rich-text editor. A textarea keeps the scope small and avoids rendering raw HTML (XSS risk).
- **Test-first workflow.** The API tests were written before the endpoints, then the endpoints were implemented until the tests passed.

## Author

Muthia Khanza