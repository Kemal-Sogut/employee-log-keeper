
import { useState, useEffect } from "react";
import { AttendanceForm } from "@/components/AttendanceForm";
import { AttendanceLog } from "@/components/AttendanceLog";
import { TotalHours } from "@/components/TotalHours";
import { SearchLogs } from "@/components/SearchLogs";
import { UserProfile } from "@/components/UserProfile";
import { useAttendance } from "@/hooks/useAttendance";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { records, loading: recordsLoading, saveRecord, getEmployeeRecords, deleteRecord } = useAttendance();
  const [lastSubmittedEmployee, setLastSubmittedEmployee] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Set the last submitted employee from user's profile if available
    if (user && records.length > 0) {
      const latestRecord = records[0];
      setLastSubmittedEmployee(latestRecord.employee_name);
    }
  }, [user, records]);

  const handleSaveRecord = async (record: { employee_name: string; date: string; time: string; action: "sign-in" | "sign-out" }) => {
    await saveRecord(record);
    setLastSubmittedEmployee(record.employee_name);
  };

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    window.location.href = '/auth';
    return null;
  }

  if (authLoading || recordsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Summer Job Attendance Tracker 
          </h1>
          <p className="text-gray-600 text-lg">
            Track your daily sign-in and sign-out times
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <AttendanceForm onSubmit={handleSaveRecord} />
            
            <div className="flex justify-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-md"
              >
                {showSearch ? "Hide Search" : "Search Employee Logs"}
              </button>
            </div>

            {showSearch && (
              <SearchLogs
                onSearch={getEmployeeRecords}
                allRecords={records}
                onDeleteRecord={deleteRecord}
              />
            )}
          </div>

          {/* Middle Column - Summary and Records */}
          <div className="space-y-6">
            <TotalHours
              records={getEmployeeRecords(lastSubmittedEmployee)}
              employeeName={lastSubmittedEmployee}
            />
            <AttendanceLog
              records={getEmployeeRecords(lastSubmittedEmployee, 14)}
              employeeName={lastSubmittedEmployee}
              onLoadMore={() => getEmployeeRecords(lastSubmittedEmployee)}
              totalRecords={getEmployeeRecords(lastSubmittedEmployee).length}
              onDeleteRecord={deleteRecord}
            />
          </div>

          {/* Right Column - User Profile */}
          <div>
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
