
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord } from "@/types/attendance";
import { Clock, User } from "lucide-react";

interface AttendanceLogProps {
  records: AttendanceRecord[];
  employeeName: string;
  onLoadMore: () => AttendanceRecord[];
  totalRecords: number;
}

export const AttendanceLog = ({ records, employeeName, onLoadMore, totalRecords }: AttendanceLogProps) => {
  const [showingAll, setShowingAll] = useState(false);
  const [displayedRecords, setDisplayedRecords] = useState(records);

  const handleLoadMore = () => {
    const allRecords = onLoadMore();
    setDisplayedRecords(allRecords);
    setShowingAll(true);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActionBadge = (action: string) => {
    if (action === "sign-in") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
          Sign In
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 font-medium">
        <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
        Sign Out
      </Badge>
    );
  };

  const recordsToShow = showingAll ? displayedRecords : records.slice(0, 14);

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Recent Activity
          {employeeName && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              for {employeeName}
            </span>
          )}
        </CardTitle>
        {recordsToShow.length > 0 && (
          <p className="text-sm text-gray-600">
            Showing {recordsToShow.length} of {totalRecords} records
          </p>
        )}
      </CardHeader>
      <CardContent>
        {recordsToShow.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">No records found</p>
            <p className="text-gray-400 text-sm">
              {employeeName 
                ? `No attendance records for ${employeeName}` 
                : "Submit an attendance record to see it here"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordsToShow.map((record) => {
              const { date, time } = formatDateTime(record.timestamp);
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-800">{record.employeeName}</h3>
                      {getActionBadge(record.action)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Date: {record.date} • Recorded: {date} at {time}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {!showingAll && totalRecords > 14 && (
              <div className="pt-4">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  Load More ({totalRecords - 14} remaining)
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
