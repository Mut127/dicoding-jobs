export type Company = {
  id: number;
  name: string;
  business_sector: string;
  employee_range: string;
  city: string | null;
};

export type Vacancy = {
  id: number;
  title: string;
  position: string;
  employment_type: string;
  candidates_needed: number;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  show_salary: boolean;
  salary_min: number | null;
  salary_max: number | null;
  min_experience: string;
  created_at: string;
  company?: Company;
};