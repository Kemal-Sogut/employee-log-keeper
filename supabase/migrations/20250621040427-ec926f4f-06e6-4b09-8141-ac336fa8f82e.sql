-- Allow viewing all attendance records by removing row level security restrictions
ALTER POLICY "Users can view their own attendance records"
  ON public.attendance_records
  USING (true);
