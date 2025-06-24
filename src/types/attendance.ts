
export interface AttendanceRecord {
  id: string;
  user_id: string;
  employee_name: string;
  date: string;
  time: string;
  action: "sign-in" | "sign-out";
  created_at: string;
  updated_at: string;
}
