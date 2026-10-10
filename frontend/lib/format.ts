export const employmentTypeLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Kontrak",
  internship: "Magang",
};

export const experienceLabels: Record<string, string> = {
  less_than_1: "Kurang dari 1 tahun",
  "1_3": "1-3 tahun",
  "4_5": "4-5 tahun",
  "6_10": "6-10 tahun",
  more_than_10: "Lebih dari 10 tahun",
};

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}