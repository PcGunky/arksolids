import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdopqkijkelgyptjztfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3Bxa2lqa2VsZ3lwdGp6dGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyNDUwNTYsImV4cCI6MjA0ODgyMTA1Nn0.Mp_XJ7vzrk64ThDksoq55U6Vlcxcz8QwETjEKYQpGJE';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the collections table if it doesn't exist
export const initializeDatabase = async () => {
  try {
    // Create the collections table if it doesn't exist
    const { error: tableError } = await supabase.rpc('init_collections_table');
    if (tableError) {
      console.error('Error initializing collections table:', tableError);
    }

    // Try to query the user_domains table
    const { error: domainsError } = await supabase
      .from('user_domains')
      .select('*')
      .limit(1);

    // If the table doesn't exist, create it
    if (domainsError && domainsError.message.includes('does not exist')) {
      const { error: createError } = await supabase.rpc('init_user_domains_table');
      if (createError) {
        console.error('Error creating user_domains table:', createError);
      }
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Call initialization when the app starts
initializeDatabase();