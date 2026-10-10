"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import type { Vacancy } from "@/lib/types";
import { employmentTypeLabels, experienceLabels } from "@/lib/format";

export type VacancyFormValues = {
  title: string;
  position: string;
  employment_type: string;
  candidates_needed: string;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  salary_min: string;
  salary_max: string;
  show_salary: boolean;
  min_experience: string;
};

export const emptyForm: VacancyFormValues = {
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
};

export function vacancyToForm(v: Vacancy): VacancyFormValues {
  return {
    title: v.title,
    position: v.position,
    employment_type: v.employment_type,
    candidates_needed: String(v.candidates_needed),
    active_until: v.active_until,
    location: v.location,
    is_remote: v.is_remote,
    description: v.description,
    salary_min: v.salary_min !== null ? String(v.salary_min) : "",
    salary_max: v.salary_max !== null ? String(v.salary_max) : "",
    show_salary: v.show_salary,
    min_experience: v.min_experience,
  };
}

export function formToPayload(f: VacancyFormValues) {
  return {
    title: f.title,
    position: f.position,
    employment_type: f.employment_type,
    candidates_needed: Number(f.candidates_needed),
    active_until: f.active_until,
    location: f.location,
    is_remote: f.is_remote,
    description: f.description,
    salary_min: f.salary_min ? Number(f.salary_min) : null,
    salary_max: f.salary_max ? Number(f.salary_max) : null,
    show_salary: f.show_salary,
    min_experience: f.min_experience,
  };
}

const positions = [
  "Product Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Android Developer",
  "iOS Developer",
  "Code Reviewer",
];
const locations = ["Bandung", "Jakarta", "Yogyakarta", "Surabaya", "Semarang"];

// Pastikan nilai yang sedang tersimpan tetap muncul di dropdown
const withCurrent = (options: string[], current: string) =>
  !current || options.includes(current) ? options : [current, ...options];

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

type Props = {
  initial: VacancyFormValues;
  submitLabel: string;
  isPending: boolean;
  error: unknown;
  onSubmit: (values: VacancyFormValues) => void;
};

export default function VacancyForm({
  initial,
  submitLabel,
  isPending,
  error,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<VacancyFormValues>(initial);

  const setField = (name: keyof VacancyFormValues, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const errors: Record<string, string[]> =
    error instanceof ApiError ? (error.errors ?? {}) : {};
  const err = (name: string) => errors[name]?.[0];
  const hasGenericError = Boolean(error) && Object.keys(errors).length === 0;

  return (
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
          {withCurrent(positions, form.position).map((p) => (
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
          {withCurrent(locations, form.location).map((l) => (
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

      <Field
        label="Rentang gaji per bulan"
        error={err("salary_max") ?? err("salary_min")}
      >
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

      {hasGenericError && (
        <p className="mb-4 text-sm text-red-600">
          Gagal menyimpan lowongan. Pastikan backend berjalan.
        </p>
      )}

      <button
        type="button"
        onClick={() => onSubmit(form)}
        disabled={isPending}
        className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : submitLabel}
      </button>
    </div>
  );
}