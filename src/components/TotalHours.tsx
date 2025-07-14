import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { calculateTotalHours, AttendanceRecord } from "@/lib/hours";

interface TotalHoursProps {
  records: AttendanceRecord[];
  employeeName: string;
}

export const TotalHours = ({ records, employeeName }: TotalHoursProps) => {
  const hours = calculateTotalHours(records);

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Hourglass className="h-5 w-5 text-indigo-600" />
          Total Worked Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {employeeName ? (
          <p className="text-3xl font-semibold text-center text-gray-800">
            {hours.toFixed(2)} hrs
          </p>
        ) : (
          <p className="text-center text-gray-600">No employee selected</p>
        )}
      </CardContent>
    </Card>
  );
};
