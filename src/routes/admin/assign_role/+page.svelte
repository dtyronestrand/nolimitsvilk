<script>
    import { supabase } from '$lib/supabaseClient';
  import Bounded from '$lib/components/Bounded.svelte';
    let email = '';
    let role = '';
  
    const assignRole = async () => {
      // Fetch the user's ID based on their email
      const { data: users, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
  
      if (fetchError) {
        alert(`Error finding user: ${fetchError.message}`);
        return;
      }
  
      const userId = users.id;
  
      // Update the role column for the user
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
  
      if (updateError) {
        alert(`Error assigning role: ${updateError.message}`);
      } else {
        alert(`Role "${role}" assigned to ${email}`);
      }
    };
  </script>
  
  <Bounded>
    <h2 class="text-center text-balance text-primary-50 text:5xl md:text-7xl mb-6">Admin: Assign Roles</h2>
    <input class="input text-surface-900 w-1/2 mb-4" type="email" bind:value={email} placeholder="User Email" />
    <select class="select text-surface-900 w-1/2 mb-8" bind:value={role}>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
        <option value="user">User</option>
        <option value="member">Member</option>
    </select>
    <button class="btn variant-ghost-success" on:click={assignRole}>Assign Role</button>
</Bounded>
  