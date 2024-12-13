<script lang="ts">
    import Bounded from '$lib/components/Bounded.svelte';
   import { goto } from '$app/navigation';
    import EpAvatar from '~icons/ep/avatar';
import { supabase } from '$lib/supabaseClient';
    let edit = false;
    let firstName = '';
    let lastName ="";
    let avatar = '';
    let role = '';
    let bio = '';
    let loading = true;
    let newAvatar : File | null = null;
  
    const loadProfile = async () => {
      // Fetch the current session
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession();
  
      if (sessionError) {
        console.error('Error fetching session:', sessionError.message);
        return;
      }
  
      if (session?.user) {
        // Fetch the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
  
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
        } else {
          firstName = profile.firstName|| '';
          role = profile.Role || '';
          bio = profile.bio || '';
          avatar = profile.avatar || '';
          lastName = profile.lastName || '';
        }
      } else {
        console.error('No user found in session.');
      }
  
      loading = false;
    };
  
    const updateProfile = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      let avatarUrl = avatar;

      if (newAvatar) {
        const fileName = `${session?.user.id}-${newAvatar.name}`;
        const {data, error} = await supabase.storage
          .from('avatars')
          .upload(fileName, newAvatar, {upsert:true});
        if (error) {  
          alert(`Error uploading picture: ${error.message}`);
          return;
      }
      const {data: publicUrlData} = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
      avatarUrl = publicUrlData.publicUrl;
    }

      if (session?.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ firstName, bio, lastName, avatar: avatarUrl })
          .eq('id', session.user.id);
  
        if (updateError) {
          alert(`Error updating profile: ${updateError.message}`);
        } else {
          alert('Profile updated successfully!');
         edit = false;
        }
      }
    };

  
    loadProfile();
  </script>
  
  <Bounded>
  {#if loading}
    <p>Loading...</p>
  {:else if edit === true}
  <div class="flex flex-row">

    <div class="mr-40 ">
      {#if avatar}
      <img src={avatar} alt="{firstName}'s Avatar" class="rounded-full w-32 h-32 mx-auto" />
      {:else}
      <EpAvatar class="w-32 h-32 mx-auto" />
      {/if}    
      <input
      type="file"
      accept="image/*"
      on:change={(e) => {
        const input = e.target;
        if (input instanceof HTMLInputElement && input.files && input.files.length > 0) {
          newAvatar = input.files[0];
        }
      }}
    />
    </div>
    <div class="text-center mx-auto">
      <h2 class=" text-5xl md:text-7xl">{firstName} {lastName}'s Profile</h2>
      <div class="flex flex-col prose prose-invert prose-lg">
        <input class="mb-8" type="text" bind:value={firstName} placeholder="Full Name" />
        <input class="mb-8" type="text" bind:value={lastName} placeholder="Last Name" />
        <textarea bind:value={bio} placeholder="Bio"></textarea>
      </div>
      <button class="btn mt-8 variant-ghost-success" on:click={updateProfile}>Save Profile</button> <button class="btn mt-8 ml-4 variant-ghost-error" on:click={() => (edit = false)}>Cancel</button>
    </div>
  </div>
    {:else}
    <div class="flex flex-row">

      <div class="mr-40">
      {#if avatar}
        <img src={avatar} alt="{firstName}'s Avatar" class="rounded-full w-32 h-32 mx-auto" />
        {:else}
        <EpAvatar class="w-32 h-32 mx-auto" />
        {/if}    
      </div>
      <div class="prose prose-invert prose-xl">
        <h2>{firstName} {lastName}'s Profile
        </h2>
        <p>Full Name: {firstName} {lastName}</p>
        <p>Bio: {bio}</p>
        <p>Role: {role}</p>
        <button class="btn mt-8 variant-ghost-secondary" on:click={() => (edit = true)}>Edit Profile</button>
      </div>
    </div>
    {/if}
  </Bounded>
  