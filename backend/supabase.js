const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Service-role client — bypasses RLS, for server-side use ONLY
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: { persistSession: false }
    }
);

module.exports = { supabase };
