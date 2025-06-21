
import { useState, useEffect } from "react";
import { AttendanceForm } from "@/components/AttendanceForm";
import { AttendanceLog } from "@/components/AttendanceLog";
import { SearchLogs } from "@/components/SearchLogs";
import { AttendanceRecord } from "@/types/attendance";

const Index = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [lastSubmittedEmployee, setLastSubmittedEmployee] = useState<string>("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Load existing records from localStorage on component mount
    const savedRecords = localStorage.getItem("attendanceRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const saveRecord = (record: Omit<AttendanceRecord, "id" | "timestamp">) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    setLastSubmittedEmployee(record.employeeName);
    
    // Save to localStorage
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    
    console.log("New attendance record saved:", newRecord);
  };

  const getEmployeeRecords = (employeeName: string, limit?: number) => {
    const employeeRecords = records.filter(
      (record) => record.employeeName.toLowerCase() === employeeName.toLowerCase()
    );
    return limit ? employeeRecords.slice(0, limit) : employeeRecords;
  };

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

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <AttendanceForm onSubmit={saveRecord} />
            
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
              />
            )}
          </div>

          {/* Right Column - Recent Records */}
          <div>
            <AttendanceLog
              records={getEmployeeRecords(lastSubmittedEmployee, 14)}
              employeeName={lastSubmittedEmployee}
              onLoadMore={() => getEmployeeRecords(lastSubmittedEmployee)}
              totalRecords={getEmployeeRecords(lastSubmittedEmployee).length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
