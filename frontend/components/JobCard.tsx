import Link from "next/link";
import type { Vacancy } from "@/lib/types";
import { employmentTypeLabels, experienceLabels, formatDate } from "@/lib/format";

export default function JobCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      data-testid="job-card"
      className="flex items-start gap-4 rounded-md border border-gray-200 p-4 transition hover:shadow-md"
    >
      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-slate-700 text-lg font-bold text-white">
        dicoding
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{vacancy.title}</h3>
        <p className="mt-1 text-xs text-gray-600">
          {vacancy.company?.name ?? "-"} ·{" "}
          {employmentTypeLabels[vacancy.employment_type] ?? vacancy.employment_type}
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {vacancy.location}
          {vacancy.is_remote ? " (Remote)" : ""} ·{" "}
          {experienceLabels[vacancy.min_experience] ?? vacancy.min_experience}
        </p>
      </div>

      <div className="hidden text-right text-xs text-gray-500 sm:block">
        <p>Dibuat pada {formatDate(vacancy.created_at)}</p>
        <p>Lamar sebelum {formatDate(vacancy.active_until)}</p>
      </div>
    </Link>
  );
}