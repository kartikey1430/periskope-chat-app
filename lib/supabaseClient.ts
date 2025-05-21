import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fdfcfjnopdbrxljbujer.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZmNmam5vcGRicnhsamJ1amVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTA3MzUsImV4cCI6MjA2MzMyNjczNX0.QH0hLIIGqQ_kanhUUXBlLHzdvxGzzbnLdV-wMG82qJI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
