<script lang="ts">
    import Bounded from '$lib/components/Bounded.svelte';
    import { supabase } from '$lib/supabaseClient';
	import type { UUID } from 'crypto';
    import { onMount } from 'svelte';

    // Define the type for a profile object based on your database schema
    interface Profile {
        id: UUID;
        firstName: string;
        lastName: string;
        Role: string;
        bio: string;
        email: string;
    }

    let profiles: Profile[] = []; // Explicitly type the profiles array

    let currentEditRow:number | null = null;

    onMount(async ()=>{
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.error(error);
        } else {
            console.log(data);
            profiles = data as Profile[]; // Cast the data to the Profile[] type
        }
    });

     const channel = supabase
     .channel('schema-db-changes')
     .on (
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'profiles'
        },
        (payload)=>{
            console.log('New profile inserted:', payload.new);
             profiles.push(payload.new as Profile);
        }
     ).subscribe()
    

</script>
<div class="grid container">
<aside>
    <p> Menu </p>
    <a href="javascript:void(0)">
      <i class="fa fa-user-o" aria-hidden="true"></i>
      My drive
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-laptop" aria-hidden="true"></i>
      Computers
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-clone" aria-hidden="true"></i>
      Shared with me
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-star-o" aria-hidden="true"></i>
      Starred
    </a>
    <a href="javascript:void(0)">
      <i class="fa fa-trash-o" aria-hidden="true"></i>
      Trash
    </a>
  </aside>
  

<section>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Bio</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {#each profiles as profile, index}
            {#if index%2==0}
                <tr  class="bg-primary-300 text-lg text-surface-600">
                    <td>{profile.id}</td>
                    {#if currentEditRow === index}
                        <td><input type="text" bind:value={profile.firstName} /></td>
                        <td><input type="text" bind:value={profile.lastName} /></td>
                        <td><input type="text" bind:value={profile.Role} /></td>
                        <td><input type="text" bind:value={profile.bio} /></td>
                        <td><input type="text" bind:value={profile.email} /></td>
                        <td><button class="btn btn-sm bg-gradient-to-br variant-filled-success text-surface-600 font-extrabold" on:click={()=>{currentEditRow = null; supabase.from('profiles').upsert(profile)}}>Save</button>&nbsp;<button class="btn btn-sm variant-filled-error text-sprimary-50 font-extrabold" on:click={()=>{currentEditRow=null;}}>Cancel</button></td>
                    {:else}
                 
                    <td>{profile.firstName}</td>
                    <td>{profile.lastName}</td>
                    <td>{profile.Role}</td>     
                    <td>{profile.bio}</td>
                    <td>{profile.email}</td>
                    <td><button class="btn btn-sm bg-gradient-to-br variant-filled-secondary text-surface-600 font-extrabold " on:click={()=>{currentEditRow = index}}>Edit User</button></td>
                    {/if}
                </tr>
            {:else}
            {#if currentEditRow === index}
            <td><input class="text-surface-600" type="text" bind:value={profile.firstName} /></td>
            <td><input class="text-surface-600"  type="text" bind:value={profile.lastName} /></td>
            <td><input class="text-surface-600"  type="text" bind:value={profile.Role} /></td>
            <td><input class="text-surface-600" type="text" bind:value={profile.bio} /></td>
            <td><input class="text-surface-600"  type="text" bind:value={profile.email} /></td>
            <td><button class="btn btn-sm bg-gradient-to-br variant-filled-success text-surface-600 font-extrabold" on:click={()=>{currentEditRow = null; supabase.from('profiles').upsert(profile)}}>Save</button>&nbsp;<button class="btn btn-sm variant-filled-error text-sprimary-50 font-extrabold" on:click={()=>{currentEditRow=null;}}>Cancel</button></td>
            {:else}
            <tr id={index.toString()} class="text-lg text-primary-100">
            <td>{profile.id}</td>
            <td>{profile.firstName}</td>
            <td>{profile.lastName}</td>
            <td>{profile.Role}</td>     
            <td>{profile.bio}</td>
            <td>{profile.email}</td>
            <td><button class="btn btn-sm  text-surface-600 font-extrabold variant-filled-secondary" on:click={()=>{currentEditRow = index}}>Edit User</button></td>
        </tr>
          {/if}
          {/if}
            {/each}
        </tbody>
    </table>
</section>
</div>
<style>
    table {
        max-width: 100%;
        grid-area:"section";
        
    }

    th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }

    th{
      @apply bg-secondary-500 text-2xl text-surface-600;
    }

    aside {

  width: 250px;
  padding-left: 20px;
  height: 100vh;
  @apply bg-gradient-to-bl from-primary-300 to-primary-600 text-surface-600 text-xl;
  border-top-right-radius: 80px;
  grid-area:"aside";
}

aside a {
  font-size: 12px;
 @apply text-surface-600 text-lg;
  display: block;
  padding: 12px;
  padding-left: 30px;
  text-decoration: none;
  -webkit-tap-highlight-color:transparent;
}

aside a:hover {

  outline: none;
  position: relative;
  @apply bg-gradient-to-r from-secondary-500 to-secondary-400 text-primary-100;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

aside a i {
  margin-right: 5px;
}
section{
    padding:20px;   
    margin-top:15px;    
    margin-left: 2rem;
}
.container {
  display: grid;
 grid-template-areas:
 "aside section section section";
 padding: 15px;
 
}
aside a:hover::after {
  content: "";
  position: absolute;
  background-color: transparent;
  bottom: 100%;
  right: 0;
  height: 35px;
  width: 35px;
  border-bottom-right-radius: 18px;
  @apply shadow-xl shadow-secondary-300;
 
}

aside a:hover::before {
  content: "";
  position: absolute;
  background-color: transparent;
  top: 38px;
  right: 0;
  height: 35px;
  width: 35px;
  border-top-right-radius: 18px;
@apply shadow-xl shadow-secondary-300;
}

aside p {
  margin: 0;
  padding: 40px 0;
}



table{
    display: inline;
}

</style>