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

const parseMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const calculateTotalHours = (records: AttendanceRecord[]): number => {
  const days: Record<string, { signIn?: string; signOut?: string }> = {};

  for (const r of records) {
    const day = days[r.date] || {};
    if (r.action === "sign-in") {
      if (!day.signIn || r.time < day.signIn) {
        day.signIn = r.time;
      }
    } else if (r.action === "sign-out") {
      if (!day.signOut || r.time > day.signOut) {
        day.signOut = r.time;
      }
    }
    days[r.date] = day;
  }

  let totalMinutes = 0;
  for (const d of Object.values(days)) {
    if (d.signIn && d.signOut) {
      let worked = parseMinutes(d.signOut) - parseMinutes(d.signIn);
      if (worked < 0) worked = 0;
      if (worked > 7 * 60) worked = 7 * 60;
      totalMinutes += worked;
    } else if (d.signIn) {
      totalMinutes += 7 * 60;
    }
  }

  return Math.round((totalMinutes / 60) * 100) / 100;
};
