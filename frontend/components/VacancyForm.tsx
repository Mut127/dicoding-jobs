"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import type { Vacancy } from "@/lib/types";
import { experienceLabels } from "@/lib/format";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[260px] rounded-md border border-gray-300" />
  ),
});

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

export const DESCRIPTION_TEMPLATE =
  "<h2>Deskripsi Pekerjaan</h2>" +
  "<p>Sebagai [Posisi Lowongan], Anda akan berpartisipasi dalam proses pembangunan aplikasi yang sedang dibangun dalam perusahaan [Nama Perusahaan]. Anda juga diharapkan mampu bekerja dalam tim.</p>" +
  "<h3>Tanggung Jawab</h3>" +
  "<ul><li><p>Membuat atau memodifikasi program yang sudah ada.</p></li>" +
  "<li><p>Bertanggung jawab dalam mengelola program.</p></li></ul>";

export const emptyForm: VacancyFormValues = {
  title: "",
  position: "",
  employment_type: "",
  candidates_needed: "",
  active_until: "",
  location: "",
  is_remote: false,
  description: DESCRIPTION_TEMPLATE,
  salary_min: "",
  salary_max: "",
  show_salary: false,
  min_experience: "",
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

const employmentOptions = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "contract", label: "Kontrak" },
  { value: "internship", label: "Intern" },
];

// Pastikan nilai yang sedang tersimpan tetap muncul di dropdown
const withCurrent = (options: string[], current: string) =>
  !current || options.includes(current) ? options : [current, ...options];

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-slate-700";

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1 text-sm font-medium">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </p>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function RupiahInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-1">
      <span className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
        Rp
      </span>
      <input
        type="number"
        min={0}
        aria-label={label}
        className={`${inputClass} rounded-l-none`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type Props = {
  initial: VacancyFormValues;
  submitLabel: string;
  isPending: boolean;
  error: unknown;
  onSubmit: (values: VacancyFormValues) => void;
  requireSalary?: boolean;
};

export default function VacancyForm({
  initial,
  submitLabel,
  isPending,
  error,
  onSubmit,
  requireSalary = false,
}: Props) {
  const [form, setForm] = useState<VacancyFormValues>(initial);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const setField = (name: keyof VacancyFormValues, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const errors: Record<string, string[]> =
    error instanceof ApiError ? (error.errors ?? {}) : {};
  const err = (name: string) => localErrors[name] ?? errors[name]?.[0];
  const hasGenericError = Boolean(error) && Object.keys(errors).length === 0;

  const handleSubmit = () => {
    if (requireSalary && !form.salary_min) {
      setLocalErrors({ salary_min: "Gaji minimum wajib diisi." });
      return;
    }
    setLocalErrors({});
    onSubmit(form);
  };

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
          e.preventDefault();
        }
      }}
    >
      <Field
        label="Judul lowongan"
        required
        hint="Contoh: Android Native Developer"
        error={err("title")}
      >
        <input
          aria-label="Judul lowongan"
          className={inputClass}
          placeholder="Masukkan judul lowongan"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </Field>

      <Field label="Posisi" required error={err("position")}>
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

      <Field label="Tipe pekerjaan" required error={err("employment_type")}>
        <div className="flex flex-col gap-2 text-sm">
          {employmentOptions.map(({ value, label }) => (
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

      <Field
        label="Kandidat yang dibutuhkan"
        required
        error={err("candidates_needed")}
      >
        <input
          type="number"
          min={1}
          aria-label="Kandidat yang dibutuhkan"
          className={inputClass}
          placeholder="Masukkan jumlah kandidat yang dibutuhkan"
          value={form.candidates_needed}
          onChange={(e) => setField("candidates_needed", e.target.value)}
        />
      </Field>

      <Field label="Aktif hingga" required error={err("active_until")}>
        <input
          type="date"
          aria-label="Aktif hingga"
          className={inputClass}
          value={form.active_until}
          onChange={(e) => setField("active_until", e.target.value)}
        />
      </Field>

      <Field label="Lokasi" required error={err("location")}>
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

      <Field
        label="Deskripsi"
        required
        hint="Anda bisa mengubah templat yang telah disediakan di atas."
        error={err("description")}
      >
        <RichTextEditor
          ariaLabel="Deskripsi"
          value={form.description}
          onChange={(html) => setField("description", html)}
        />
      </Field>

      <Field
        label="Rentang gaji per bulan"
        required
        error={err("salary_min") ?? err("salary_max")}
      >
        <div className="flex items-center gap-2">
          <RupiahInput
            label="Gaji minimum"
            placeholder="Minimum"
            value={form.salary_min}
            onChange={(v) => setField("salary_min", v)}
          />
          <span className="text-gray-500">-</span>
          <RupiahInput
            label="Gaji maksimum"
            placeholder="Maksimum (opsional)"
            value={form.salary_max}
            onChange={(v) => setField("salary_max", v)}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Anda tidak perlu mengisi kolom &quot;Maksimum&quot; jika yang dimasukkan
          adalah gaji pokok.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={form.show_salary}
            aria-label="Tampilkan gaji"
            onClick={() => setField("show_salary", !form.show_salary)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.show_salary ? "bg-slate-800" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                form.show_salary ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>
          <span className="text-sm">Tampilkan gaji</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh
          kandidat.
        </p>
      </Field>

      <Field
        label="Minimum pengalaman bekerja"
        required
        error={err("min_experience")}
      >
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

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-md bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : submitLabel}
        </button>
        <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
          Batal
        </Link>
      </div>
    </div>
  );
}