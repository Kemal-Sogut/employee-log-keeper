
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { AttendanceRecord } from "@/types/attendance";
import { toast } from "@/hooks/use-toast";

interface AttendanceFormProps {
  onSubmit: (record: Omit<AttendanceRecord, "id" | "timestamp">) => void;
}

export const AttendanceForm = ({ onSubmit }: AttendanceFormProps) => {
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [action, setAction] = useState<"sign-in" | "sign-out" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeName.trim() || !date || !action) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        employeeName: employeeName.trim(),
        date,
        action: action as "sign-in" | "sign-out",
      });

      toast({
        title: "Success!",
        description: `${action === "sign-in" ? "Signed in" : "Signed out"} successfully recorded for ${employeeName}`,
      });

      // Reset form
      setEmployeeName("");
      setDate(new Date().toISOString().split('T')[0]);
      setAction("");
      
      console.log("Form submitted successfully");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-600" />
          Record Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee-name" className="text-sm font-medium text-gray-700">
              Employee Name
            </Label>
            <Input
              id="employee-name"
              type="text"
              placeholder="Enter your full name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action" className="text-sm font-medium text-gray-700">
              Action
            </Label>
            <Select value={action} onValueChange={(value: "sign-in" | "sign-out") => setAction(value)} disabled={isSubmitting}>
              <SelectTrigger className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="sign-in" className="hover:bg-green-50">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Sign In
                  </span>
                </SelectItem>
                <SelectItem value="sign-out" className="hover:bg-red-50">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Sign Out
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200 shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Recording..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
