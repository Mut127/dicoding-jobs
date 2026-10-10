import type { Vacancy } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? "Request failed", body?.errors);
  }
  return body as T;
}

export async function getVacancies(search = ""): Promise<Vacancy[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await request<{ data: Vacancy[] }>(`/vacancies${query}`);
  return res.data;
}

export async function getVacancy(id: string | number): Promise<Vacancy> {
  const res = await request<{ data: Vacancy }>(`/vacancies/${id}`);
  return res.data;
}

export async function createVacancy(payload: Record<string, unknown>): Promise<Vacancy> {
  const res = await request<{ data: Vacancy }>("/vacancies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}