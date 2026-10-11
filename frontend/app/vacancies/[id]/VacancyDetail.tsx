"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ApiError, getVacancy } from "@/lib/api";
import { employmentTypeLabels, experienceLabels } from "@/lib/format";
import Image from "next/image";
import { Building2, MapPin, Users } from "lucide-react";
import DOMPurify from "dompurify";

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
          <Image
            src="/images/icon_vacancy.svg"
            alt="Dicoding"
            width={80}
            height={80}
            unoptimized
            className="shrink-0 rounded"
          />
          <div>
            <h1 className="text-xl font-bold" data-testid="vacancy-title">
              {vacancy.title}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Sektor Bisnis: {vacancy.company?.business_sector}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Building2 size={14} />
                <span className="text-blue-600 underline">{vacancy.company?.name}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {vacancy.location}
                {vacancy.is_remote ? " (Remote)" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {vacancy.company?.employee_range} Karyawan
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-8">
        <span className="inline-block rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {employmentTypeLabels[vacancy.employment_type] ?? vacancy.employment_type}
        </span>

        <div
          className="rich-text mt-6 whitespace-pre-line text-sm leading-relaxed text-gray-700"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(vacancy.description),
          }}
        />

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