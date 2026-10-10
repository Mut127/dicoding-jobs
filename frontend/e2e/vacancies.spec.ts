import { test, expect } from "@playwright/test";

const API_URL = "http://127.0.0.1:8000/api";

test.describe("Dicoding Jobs", () => {
  let title: string;
  let vacancyId: number;

  test.beforeAll(async ({ request }) => {
    title = `E2E Engineer ${Date.now()}`;

    const activeUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const res = await request.post(`${API_URL}/vacancies`, {
      headers: { Accept: "application/json" },
      data: {
        company_id: 1,
        title,
        position: "Product Engineer",
        employment_type: "full_time",
        candidates_needed: 1,
        active_until: activeUntil,
        location: "Bandung",
        is_remote: false,
        description: "Lowongan untuk pengujian end-to-end.",
        salary_min: 5000000,
        salary_max: 8000000,
        show_salary: true,
        min_experience: "1_3",
      },
    });

    expect(res.ok()).toBeTruthy();
    vacancyId = (await res.json()).data.id;
  });

  test.afterAll(async ({ request }) => {
    await request.delete(`${API_URL}/vacancies/${vacancyId}`, {
      headers: { Accept: "application/json" },
    });
  });

  test("user opens the vacancies list page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Daftar Pekerjaan Terbaru" })
    ).toBeVisible();
    await expect(page.getByTestId("job-card").first()).toBeVisible();
  });

  test("user searches a job by title", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Cari lowongan").fill(title);

    await expect(
      page.getByRole("heading", { name: "Hasil Pencarian" })
    ).toBeVisible();
    await expect(page.getByTestId("job-card")).toHaveCount(1);
    await expect(page.getByTestId("job-card")).toContainText(title);
  });

    test("user views vacancy details", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Cari lowongan").fill(title);

    // Tunggu sampai hasil pencarian benar-benar terfilter
    await expect(page.getByTestId("job-card")).toHaveCount(1);

    await page.getByTestId("job-card").click();

    await expect(page).toHaveURL(/\/vacancies\/\d+$/);
    await expect(page.getByTestId("vacancy-title")).toHaveText(title);
    await expect(page.getByText("Deskripsi Pekerjaan")).toBeVisible();
  });
});