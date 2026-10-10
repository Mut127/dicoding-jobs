"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVacancy } from "@/lib/api";
import VacancyForm, {
  emptyForm,
  formToPayload,
  type VacancyFormValues,
} from "@/components/VacancyForm";

// Perusahaan default dari seeder (Dicoding Indonesia)
const DEFAULT_COMPANY_ID = 1;

export default function NewVacancyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: VacancyFormValues) =>
      createVacancy({ company_id: DEFAULT_COMPANY_ID, ...formToPayload(values) }),
    onSuccess: (vacancy) => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
      router.push(`/vacancies/${vacancy.id}`);
    },
  });

  return (
    <>
      <section className="bg-neutral-900 py-10 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-2xl font-bold">Buat lowongan pekerjaan</h1>
          <p className="mt-2 text-sm text-gray-300">
            Dicoding Jobs menghubungkan industri dengan talenta yang tepat.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-md px-6 py-10">
        <VacancyForm
          initial={emptyForm}
          submitLabel="Buat lowongan"
          isPending={mutation.isPending}
          error={mutation.error}
          onSubmit={(values) => mutation.mutate(values)}
        />
      </div>
    </>
  );
}