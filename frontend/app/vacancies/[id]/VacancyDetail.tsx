"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ApiError, getVacancy } from "@/lib/api";
import { employmentTypeLabels, experienceLabels } from "@/lib/format";

export default function VacancyDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: vacancy, isLoading, error } = useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => getVacancy(id),
    retry: false,
  });

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-6 py-10 text-sm text-gray-500">Memuat lowongan...</p>;
  }

  if (error || !vacancy) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-red-600">
          {notFound ? "Lowongan tidak ditemukan." : "Gagal memuat lowongan."}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Kembali ke daftar lowongan
        </Link>
      </div>
    );
  }

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <article>
      <section className="border-b border-gray-200">
        <div className="mx-auto flex max-w-3xl items-center gap-5 px-6 py-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-slate-700 text-sm font-bold text-white">
            dicoding
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="vacancy-title">
              {vacancy.title}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Sektor Bisnis: {vacancy.company?.business_sector}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {vacancy.company?.name} · {vacancy.location}
              {vacancy.is_remote ? " (Remote)" : ""} · {vacancy.company?.employee_range} Karyawan
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <span className="inline-block rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {employmentTypeLabels[vacancy.employment_type] ?? vacancy.employment_type}
        </span>

        <h2 className="mt-6 font-semibold">Deskripsi Pekerjaan</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
          {vacancy.description}
        </p>

        <h2 className="mt-8 font-semibold">Informasi Tambahan</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium">Pengalaman bekerja</dt>
            <dd className="text-gray-600">
              {experienceLabels[vacancy.min_experience] ?? vacancy.min_experience}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Kandidat yang dibutuhkan</dt>
            <dd className="text-gray-600">{vacancy.candidates_needed} kandidat</dd>
          </div>
          {vacancy.show_salary && vacancy.salary_min !== null && vacancy.salary_max !== null && (
            <div className="col-span-2">
              <dt className="font-medium">Rentang gaji per bulan</dt>
              <dd className="text-gray-600">
                {formatRupiah(vacancy.salary_min)} - {formatRupiah(vacancy.salary_max)}
              </dd>
            </div>
          )}
        </dl>
      </section>
    </article>
  );
}