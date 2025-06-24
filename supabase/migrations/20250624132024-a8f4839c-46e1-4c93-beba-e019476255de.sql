
-- Add time column to store selected time for attendance records
ALTER TABLE public.attendance_records
  ADD COLUMN time TIME NOT NULL DEFAULT '00:00';
