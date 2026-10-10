"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getVacancy, updateVacancy } from "@/lib/api";
import VacancyForm, {
  formToPayload,
  vacancyToForm,
  type VacancyFormValues,
} from "@/components/VacancyForm";

export default function EditVacancy() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: vacancy, isLoading, error } = useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => getVacancy(id),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (values: VacancyFormValues) =>
      updateVacancy(id, {
        company_id: vacancy?.company?.id,
        ...formToPayload(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      queryClient.invalidateQueries({ queryKey: ["vacancy", id] });
      router.push("/dashboard");
    },
  });

  if (isLoading) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-10 text-sm text-gray-500">
        Memuat lowongan...
      </p>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-red-600">Lowongan tidak ditemukan.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Kembali ke dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-neutral-900 py-10 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-2xl font-bold">Edit lowongan pekerjaan</h1>
          <p className="mt-2 text-sm text-gray-300">{vacancy.title}</p>
        </div>
      </section>

      <div className="mx-auto max-w-md px-6 py-10">
        <VacancyForm
          initial={vacancyToForm(vacancy)}
          submitLabel="Simpan perubahan"
          isPending={mutation.isPending}
          error={mutation.error}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </div>
    </>
  );
}