import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create admin user in auth
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: 'admin123@greenovate.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'System Administrator',
        role: 'admin'
      }
    })

    if (authError && !authError.message.includes('already been registered')) {
      throw authError
    }

    // Create or update admin profile
    const adminId = authUser?.user?.id || '00000000-0000-0000-0000-000000000001'
    
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: adminId,
        email: 'admin123@greenovate.com',
        full_name: 'System Administrator',
        role: 'admin',
        points: 0,
        level: 1,
        streak_days: 0
      })

    if (profileError) {
      throw profileError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully',
        adminId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})