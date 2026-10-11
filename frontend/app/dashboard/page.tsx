"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Clock, Pencil, Trash2, Upload } from "lucide-react";
import { deleteVacancy, getVacancies } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacancies", "dashboard"],
    queryFn: () => getVacancies(),
  });
  
  const [toDelete, setToDelete] = useState<{ id: number; title: string } | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      toast.success("Lowongan berhasil dihapus");
      setToDelete(null);
    },
    onError: () => {
      toast.error("Gagal menghapus lowongan");
      setToDelete(null);
    },
  });

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
      <aside className="hidden w-52 shrink-0 sm:block">
        <Image src="/images/sidebar_icon.svg" alt="Jobs" width={500} height={100} unoptimized className="ml-3 block h-auto w-[500px]" />
        <div className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm font-medium">
          <Briefcase size={16} />
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
        {isError && <p className="text-sm text-red-600">Gagal memuat lowongan.</p>}
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
              <Image
                src="/images/dashboard_card_icon.svg"
                alt="Dicoding"
                width={48}
                height={48}
                unoptimized
                className="shrink-0 rounded"
              />
              <div className="flex-1">
                <Link
                  href={`/vacancies/${vacancy.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {vacancy.title}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Upload size={13} />
                    Dibuat: {formatDate(vacancy.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    Aktif hingga: {formatDate(vacancy.active_until)}
                  </span>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/vacancies/${vacancy.id}/edit`}
                    className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                  >
                    <Pencil size={13} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete({ id: vacancy.id, title: vacancy.title })}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1.5 rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200 disabled:opacity-60"
                  >
                    <Trash2 size={13} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ConfirmDialog
        open={toDelete !== null}
        title="Hapus lowongan?"
        message={`Lowongan "${toDelete?.title ?? ""}" akan dihapus dan tidak bisa dikembalikan.`}
        confirmLabel="Ya, hapus"
        cancelLabel="Batal"
        isPending={deleteMutation.isPending}
        onConfirm={() => toDelete && deleteMutation.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}