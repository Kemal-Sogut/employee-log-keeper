
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceRecord {
  id: string;
  user_id: string;
  employee_name: string;
  date: string;
  action: "sign-in" | "sign-out";
  created_at: string;
  updated_at: string;
}

interface SearchLogsProps {
  onSearch: (employeeName: string) => AttendanceRecord[];
  allRecords: AttendanceRecord[];
  onDeleteRecord: (id: string) => void;
}

export const SearchLogs = ({ onSearch, allRecords, onDeleteRecord }: SearchLogsProps) => {
  const { user } = useAuth();
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState<AttendanceRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    const sanitizedSearchName = searchName.trim().replace(/[<>]/g, '');
    const results = onSearch(sanitizedSearchName);
    setSearchResults(results);
    setHasSearched(true);
    console.log(`Searching for records for: ${sanitizedSearchName}`);
    console.log(`Found ${results.length} records`);
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

  // Get unique employee names for suggestions (only from current user's records)
  const uniqueEmployees = Array.from(new Set(allRecords.map(record => record.employee_name)));

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          Search Employee Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter employee name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              list="employee-suggestions"
              maxLength={100}
            />
            <datalist id="employee-suggestions">
              {uniqueEmployees.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            >
              Search
            </Button>
          </div>
        </form>

        {hasSearched && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Search Results for "{searchName}" ({searchResults.length} records)
            </h3>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-6">
                <User className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No records found for "{searchName}"</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((record) => {
                  const { date, time } = formatDateTime(record.created_at);
                  const [d, t] = record.date.split(" ");
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-800">{record.employee_name}</h4>
                          {getActionBadge(record.action)}
                        </div>
                        <p className="text-xs text-gray-600">
                          Date: {d}{t ? ` at ${t}` : ""} • Recorded: {date} at {time}
                        </p>
                      </div>
                      {record.user_id === user?.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
