import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load() {
  const { data: session } = await supabase.auth.getSession();

  if (!session) {
    throw redirect(303, '/login');
  }

  return {};
}
