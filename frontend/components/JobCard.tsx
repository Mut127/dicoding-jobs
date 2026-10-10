import Image from "next/image";
import Link from "next/link";
import { Briefcase, Building2, MapPin } from "lucide-react";
import type { Vacancy } from "@/lib/types";
import { employmentTypeLabels, experienceLabels, formatDate } from "@/lib/format";

export default function JobCard({ vacancy }: { vacancy: Vacancy }) {
  return (
    <Link
      href={`/vacancies/${vacancy.id}`}
      data-testid="job-card"
      className="flex items-start gap-4 rounded-md border border-gray-200 p-4 transition hover:shadow-md"
    >
      <Image
        src="/images/icon_vacancy.svg"
        alt="Dicoding"
        width={64}
        height={64}
        unoptimized
        className="shrink-0 rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{vacancy.title}</h3>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Building2 size={14} />
            {vacancy.company?.name ?? "-"}
          </span>
          <span>
            {employmentTypeLabels[vacancy.employment_type] ?? vacancy.employment_type}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {vacancy.location}
            {vacancy.is_remote ? " (Remote)" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={14} />
            {experienceLabels[vacancy.min_experience] ?? vacancy.min_experience}
          </span>
        </div>
      </div>

      <div className="hidden text-right text-xs text-gray-500 sm:block">
        <p>Dibuat pada {formatDate(vacancy.created_at)}</p>
        <p>Lamar sebelum {formatDate(vacancy.active_until)}</p>
      </div>
    </Link>
  );
}