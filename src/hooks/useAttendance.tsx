
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  employee_name: string;
  date: string;
  action: "sign-in" | "sign-out";
  created_at: string;
  updated_at: string;
}

export const useAttendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const fetchRecords = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords((data || []) as AttendanceRecord[]);
    } catch (error: any) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecord = async (record: { employee_name: string; date: string; action: "sign-in" | "sign-out" }) => {
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to record attendance.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert([
          {
            user_id: user.id,
            employee_name: record.employee_name,
            date: record.date,
            action: record.action,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setRecords(prev => [data as AttendanceRecord, ...prev]);
      
      toast({
        title: "Success!",
        description: `${record.action === "sign-in" ? "Signed in" : "Signed out"} successfully recorded.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error saving record:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance record.",
        variant: "destructive",
      });
    }
  };

  const getEmployeeRecords = (employeeName: string, limit?: number) => {
    const employeeRecords = records.filter(
      (record) => record.employee_name.toLowerCase() === employeeName.toLowerCase()
    );
    return limit ? employeeRecords.slice(0, limit) : employeeRecords;
  };

  useEffect(() => {
    if (session) {
      fetchRecords();
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [session]);

  return {
    records,
    loading,
    saveRecord,
    getEmployeeRecords,
    fetchRecords,
  };
};
