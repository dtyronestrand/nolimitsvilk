<script lang="ts">
	import '../app.css';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import '@fontsource-variable/dm-sans';
	import '@fontsource/protest-riot';
	import type { Session } from '@supabase/supabase-js';
	import Header2 from '$lib/components/Header2.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { supabase } from '$lib/supabaseClient';
	let session: Session | null = null;

const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
	console.error('Error fetching session:', error.message);
  } else {
	session = data.session; // Set session if user is logged in
  }
};

checkSession();

// Listen for auth changes to dynamically update the header
supabase.auth.onAuthStateChange((event, sessionData) => {
  session = sessionData;
});

  
</script>



<svelte:head>
	<title>{$page.data.title}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>
{#if session}
<Header2 globals={$page.data.globals} />
{:else}
<Header globals={$page.data.globals} />
{/if}
<main>
	<slot></slot>
</main>
<Footer globals={$page.data.globals}/>
<PrismicPreview {repositoryName}></PrismicPreview>
