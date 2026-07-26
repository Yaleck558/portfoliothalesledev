import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjalhayeuksrvbdkrfrr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_DlJSSReI2t_KpJh7vP8LLA_BZG6jGDf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);