import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vboovedckhmcddoseufl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZib292ZWRja2htY2Rkb3NldWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTczODQsImV4cCI6MjA4ODM5MzM4NH0.xgDd7FFqOW-D3ZsOOa6gXumQvzRvoYV04c-t7bLsvm0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
