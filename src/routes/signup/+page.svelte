<script>
    import { supabase } from '$lib/supabaseClient';
    import Bounded from '$lib/components/Bounded.svelte';
import {goto} from '$app/navigation';
    let email = '';
    let password = '';
    let firstName="";
    let lastName="";
    let role="User";

    const handleSignup =async ()=>{
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
 
    });

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    if (data.user) {
      // Create a profile only if user creation was successful
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email: data.user.email, Role: "Registered", firstName: firstName, lastName: lastName });

      if (profileError) {
        alert(`Error creating profile: ${profileError.message}`);
      } else {
        alert('Signup successful! Check your email for a confirmation link.');
        goto('/login');
      
      }
    } else {
      console.error('User creation was not successful.');
    }
   
  };
      
  </script>
  <Bounded>

      <div class="rounded-xl border-2 border-primary-500 bg-primary-500/20 p-10">
          <h2 class="mx-auto mb-8 text-primary-50 text-5xl md:text-7xl">Sign Up</h2>
          <p>Already have an account? <a href="/login">Log In</a></p>
          <form class="flex flex-col p-8">
            <input class="input my-6 text-surface-900" type="text" bind:value={firstName} placeholder="First Name" />
            <input class="input my-6 text-surface-900" type="text" bind:value={lastName} placeholder="Last Name" />
              <input class="input my-6 text-surface-900" title="Input (email)" type="email" bind:value={email} placeholder="example@email.com" autocomplete="email" />
              <input class="input" title="Input (password)" type="password" bind:value={password} placeholder="Password" />
              <button class="btn variant-ghost-secondary mt-8" on:click={handleSignup}>Sign Up</button>
            </form>
        </div>
    </Bounded>
  