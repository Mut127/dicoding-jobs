"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVacancies } from "@/lib/api";
import JobCard from "@/components/JobCard";
import HeroPhoto from "@/components/HeroPhoto";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vacancies", debounced],
    queryFn: () => getVacancies(debounced),
  });

  return (
    <>
      <section className="bg-neutral-900 py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm font-medium text-blue-400">Dicoding Jobs</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            Temukan lowongan yang
            <br />
            cocok untuk kamu{" "}
            <HeroPhoto className="ml-2 h-10 w-36 sm:h-12 sm:w-40" />
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">
            {debounced ? "Hasil Pencarian" : "Daftar Pekerjaan Terbaru"}
          </h2>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pekerjaan apa yang sedang kamu cari?"
            aria-label="Cari lowongan"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-slate-700 sm:w-72"
          />
        </div>

        {isLoading && <p className="text-sm text-gray-500">Memuat lowongan...</p>}
        {isError && (
          <p className="text-sm text-red-600">
            Gagal memuat lowongan. Pastikan backend berjalan.
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-gray-500">Tidak ada lowongan yang ditemukan.</p>
        )}

        <div className="flex flex-col gap-4">
          {data?.map((vacancy) => (
            <JobCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      </section>
    </>
  );
}