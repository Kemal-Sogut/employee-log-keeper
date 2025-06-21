
export interface AttendanceRecord {
  id: string;
  employeeName: string;
  date: string;
  action: "sign-in" | "sign-out";
  timestamp: string;
}
