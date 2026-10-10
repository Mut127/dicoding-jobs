"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, createVacancy } from "@/lib/api";
import { employmentTypeLabels, experienceLabels } from "@/lib/format";

// Perusahaan default dari seeder (Dicoding Indonesia)
const DEFAULT_COMPANY_ID = 1;

const positions = [
  "Product Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Android Developer",
  "iOS Developer",
  "Code Reviewer",
];
const locations = ["Bandung", "Jakarta", "Yogyakarta", "Surabaya", "Semarang"];

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-700";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-sm font-medium">{label}</p>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function NewVacancyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    position: "",
    employment_type: "full_time",
    candidates_needed: "1",
    active_until: "",
    location: "",
    is_remote: false,
    description: "",
    salary_min: "",
    salary_max: "",
    show_salary: false,
    min_experience: "less_than_1",
  });

  const setField = (name: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const mutation = useMutation({
    mutationFn: () =>
      createVacancy({
        company_id: DEFAULT_COMPANY_ID,
        title: form.title,
        position: form.position,
        employment_type: form.employment_type,
        candidates_needed: Number(form.candidates_needed),
        active_until: form.active_until,
        location: form.location,
        is_remote: form.is_remote,
        description: form.description,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        show_salary: form.show_salary,
        min_experience: form.min_experience,
      }),
    onSuccess: (vacancy) => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      router.push(`/vacancies/${vacancy.id}`);
    },
  });

  const errors: Record<string, string[]> =
    mutation.error instanceof ApiError ? (mutation.error.errors ?? {}) : {};
  const err = (name: string) => errors[name]?.[0];

  return (
    <>
      <section className="bg-neutral-900 py-10 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-2xl font-bold">Buat lowongan pekerjaan</h1>
          <p className="mt-2 text-sm text-gray-300">
            Dicoding Jobs menghubungkan industri dengan talenta yang tepat.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-md px-6 py-10">
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
              e.preventDefault();
            }
          }}
        >
          <Field label="Judul lowongan *" error={err("title")}>
            <input
              aria-label="Judul lowongan"
              className={inputClass}
              placeholder="Masukkan judul lowongan"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
            />
          </Field>

          <Field label="Posisi *" error={err("position")}>
            <select
              aria-label="Posisi"
              className={inputClass}
              value={form.position}
              onChange={(e) => setField("position", e.target.value)}
            >
              <option value="">Pilih posisi yang dicari</option>
              {positions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tipe pekerjaan *" error={err("employment_type")}>
            <div className="flex flex-col gap-2 text-sm">
              {Object.entries(employmentTypeLabels).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="employment_type"
                    checked={form.employment_type === value}
                    onChange={() => setField("employment_type", value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Kandidat yang dibutuhkan *" error={err("candidates_needed")}>
            <input
              type="number"
              min={1}
              aria-label="Kandidat yang dibutuhkan"
              className={inputClass}
              value={form.candidates_needed}
              onChange={(e) => setField("candidates_needed", e.target.value)}
            />
          </Field>

          <Field label="Aktif hingga *" error={err("active_until")}>
            <input
              type="date"
              aria-label="Aktif hingga"
              className={inputClass}
              value={form.active_until}
              onChange={(e) => setField("active_until", e.target.value)}
            />
          </Field>

          <Field label="Lokasi *" error={err("location")}>
            <select
              aria-label="Lokasi"
              className={inputClass}
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            >
              <option value="">Pilih lokasi</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_remote}
                onChange={(e) => setField("is_remote", e.target.checked)}
              />
              Bisa remote
            </label>
          </Field>

          <Field label="Deskripsi *" error={err("description")}>
            <textarea
              aria-label="Deskripsi"
              rows={8}
              className={inputClass}
              placeholder="Tuliskan deskripsi pekerjaan dan tanggung jawab"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>

          <Field label="Rentang gaji per bulan" error={err("salary_max") ?? err("salary_min")}>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                aria-label="Gaji minimum"
                className={inputClass}
                placeholder="Minimum (Rp)"
                value={form.salary_min}
                onChange={(e) => setField("salary_min", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                min={0}
                aria-label="Gaji maksimum"
                className={inputClass}
                placeholder="Maksimum (Rp)"
                value={form.salary_max}
                onChange={(e) => setField("salary_max", e.target.value)}
              />
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.show_salary}
                onChange={(e) => setField("show_salary", e.target.checked)}
              />
              Tampilkan gaji
            </label>
          </Field>

          <Field label="Minimum pengalaman bekerja *" error={err("min_experience")}>
            <div className="flex flex-col gap-2 text-sm">
              {Object.entries(experienceLabels).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="min_experience"
                    checked={form.min_experience === value}
                    onChange={() => setField("min_experience", value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </Field>

          {mutation.isError && Object.keys(errors).length === 0 && (
            <p className="mb-4 text-sm text-red-600">
              Gagal membuat lowongan. Pastikan backend berjalan.
            </p>
          )}

          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {mutation.isPending ? "Menyimpan..." : "Buat lowongan"}
          </button>
        </div>
      </div>
    </>
  );
}