import { Suspense } from "react";
import EditVacancy from "./EditVacancy";

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-3xl px-6 py-10 text-sm text-gray-500">
          Memuat lowongan...
        </p>
      }
    >
      <EditVacancy />
    </Suspense>
  );
}