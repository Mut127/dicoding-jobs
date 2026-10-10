"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteVacancy, getVacancies } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacancies", "dashboard"],
    queryFn: () => getVacancies(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVacancy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vacancies"] }),
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Hapus lowongan "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
      <aside className="hidden w-52 shrink-0 sm:block">
        <p className="mb-4 text-xl font-semibold text-slate-700">Jobs</p>
        <div className="rounded bg-gray-100 px-3 py-2 text-sm font-medium">
          Lowongan Saya
        </div>
      </aside>

      <section className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lowongan Saya</h1>
          <Link
            href="/vacancies/new"
            className="rounded bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            + Buat lowongan
          </Link>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Memuat lowongan...</p>}
        {isError && (
          <p className="text-sm text-red-600">Gagal memuat lowongan.</p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada lowongan.</p>
        )}

        <div className="flex flex-col gap-4">
          {data?.map((vacancy) => (
            <div
              key={vacancy.id}
              data-testid="dashboard-item"
              className="flex items-start gap-4 rounded-md border border-gray-200 p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-slate-700 font-bold text-white">
                g
              </div>
              <div className="flex-1">
                <Link
                  href={`/vacancies/${vacancy.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {vacancy.title}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  Dibuat: {formatDate(vacancy.created_at)} · Aktif hingga:{" "}
                  {formatDate(vacancy.active_until)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/vacancies/${vacancy.id}/edit`}
                    className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(vacancy.id, vacancy.title)}
                    disabled={deleteMutation.isPending}
                    className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200 disabled:opacity-60"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}