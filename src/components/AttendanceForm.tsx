import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceFormProps {
  onSubmit: (record: { employee_name: string; date: string; action: "sign-in" | "sign-out" }) => Promise<void>;
}

export const AttendanceForm = ({ onSubmit }: AttendanceFormProps) => {
  const [employeeName, setEmployeeName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [action, setAction] = useState<"sign-in" | "sign-out" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch user's profile to get employee name
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('employee_name')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setEmployeeName(data.employee_name);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeName.trim() || !date || !action) {
      toast({
        title: "Missing Information",
        description: "Please select an action before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (selectedDate > today) {
      toast({
        title: "Invalid Date",
        description: "Cannot record attendance for future dates.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        employee_name: employeeName.trim(),
        date,
        action: action as "sign-in" | "sign-out",
      });

      toast({
        title: "Success!",
        description: `${action === "sign-in" ? "Signed in" : "Signed out"} successfully recorded for ${employeeName}`,
      });

      // Reset only the action, keep date and name
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
            <Label className="text-sm font-medium text-gray-700">
              Employee Name
            </Label>
            <div className="h-11 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {employeeName || "Loading..."}
            </div>
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
              max={new Date().toISOString().split('T')[0]}
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
