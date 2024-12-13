<script lang="ts">
	import { PrismicLink } from '@prismicio/svelte';
	import IconClose from '~icons/ph/x-bold';
	import IconMenu from '~icons/ph/list-bold';
    import {supabase} from '$lib/supabaseClient';
	import ButtonLink from './ButtonLink.svelte';
	import clsx from 'clsx';
	import { asLink } from '@prismicio/client';
	import { page } from '$app/stores';
    import type { Session } from '@supabase/supabase-js';
    let profile: any = {}; // Or explicitly type this if you know the structure
let session: Session | null = null; // Explicitly declare the session type

const fetchProfile = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error fetching session:', error.message);
    return;
  }

  session = data.session; // Explicitly set the session

  if (session?.user) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profileError) {
      profile = profileData;
    } else {
      console.error('Error fetching profile:', profileError.message);
    }
  }
};

fetchProfile();
	
	
	/** @type {import("@prismicio/client").Content.GlobalsDocument} */
	export let globals;

	let isOpen = false;
	const toggleOpen = () => (isOpen = !isOpen);
	const close = () => (isOpen = false);

	/** @param {import('@prismicio/client').LinkField} link*/
	const isActive = (link) => {
		const path = asLink(link);
		if (!path) return false;
		
		// Exact match for home page
		if (path === '/') {
			return $page.url.pathname === '/';
		}
		
		// For other pages, check if the current path starts with the link path
		return $page.url.pathname.startsWith(path);
	};
    console.log(globals.data.navigation)
</script>

<header class="p-4 md:p-6">
	<nav
		class="mx-auto flex max-w-6xl flex-col justify-between py-2 font-medium text-2xl md:flex-row md:items-center"
		aria-label="Main"
	>
		<div class="flex items-center justify-between">
			<a href="/" on:click={close} class="z-50">
				<span class="sr-only">{globals.data.site_title} home page</span>
			</a>

			<button
				type="button"
				class="block p-2 text-3xl md:hidden"
				aria-expanded={isOpen}
				on:click={toggleOpen}
			>
				<IconMenu />
			</button>
		</div>

		<!-- Mobile Nav -->
		<div
			class={clsx(
				'fixed inset-0 z-40 flex flex-col items-end bg-gray-950 pr-4 pt-6 transition-transform duration-300 ease-in-out md:hidden',
				isOpen ? 'translate-x-0' : 'translate-x-[100%]'
			)}
		>
			<button
				aria-expanded={isOpen}
				type="button"
				class="block p-2 text-3xl text-white md:hidden"
				on:click={toggleOpen}
			>
				<IconClose />
			</button>
			<ul class="grid justify-items-end gap-8">
				{#each globals.data.navigation as {cta_button, link, label, role_based, role}}
                <li>
                    {#if cta_button}
                    <div class="hidden">
                        <ButtonLink
                        field={link}
                        on:click={close}
                        aria-current={isActive(link) ? 'page' : undefined}
                        >
                        {label}
                    </ButtonLink>
                    </div>
						{:else if role_based && role !== profile.role}
                        <div class="hidden">

                            <PrismicLink
                            on:click={close}
                            field={link}
                            class="group first:mt-8 relative block overflow-hidden rounded px-3 py-1 text-3xl font-bold text-primary-100"
                            aria-current={isActive(link) ? 'page' : undefined}
                            >
                            <span 
                            class={`absolute inset-0 z-0 h-full rounded bg-orange-600 transition-transform duration-300 ease-in-out group-hover:translate-y-0 ${
                                isActive(link) ? 'translate-y-[calc(100%-4px)]' : 'translate-y-[100%]'
                                }`}
                        />
                        <span class="relative">{label}</span>
                    </PrismicLink>
                </div>
                    {:else}
							<PrismicLink
								on:click={close}
								field={link}
								class="group first:mt-8 relative block overflow-hidden rounded px-3 py-1 text-3xl font-bold text-primary-100"
								aria-current={isActive(link) ? 'page' : undefined}
							>
								<span 
									class={`absolute inset-0 z-0 h-full rounded bg-orange-600 transition-transform duration-300 ease-in-out group-hover:translate-y-0 ${
										isActive(link) ? 'translate-y-[calc(100%-4px)]' : 'translate-y-[100%]'
									}`}
								/>
								<span class="relative">{label}</span>
							</PrismicLink>
						{/if}
					</li>
				{/each}
                <a href="/profile">{profile.full_name}</a>
                <button class="btn variant-ghost-secondary" on:click={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                }}>Sign Out</button>
			</ul>
		</div>
		<!-- Desktop Nav -->
		<ul class="hidden gap-6 md:flex">
			{#each globals.data.navigation as {cta_button, link, label, role_based, role}}
				<li>
					{#if cta_button}
                    <div class="hidden">
						<ButtonLink
						field={link}
						on:click={close}
						aria-current={isActive(link) ? 'page' : undefined}
						>
						{label}
					</ButtonLink>
                    </div>
					{:else if role_based && role !== profile.Role}
					<div class="hidden">	
                    <PrismicLink
							on:click={close}
							field={link}
							class="group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-primary-100"
							aria-current={isActive(link) ? 'page' : undefined}
						>
							<span class={`absolute inset-0 z-0 h-full rounded bg-orange-600 transition-transform duration-300 ease-in-out group-hover:translate-y-0 ${isActive(link) ? 'translate-y-[calc(100%-5px)]' : 'translate-y-[100%]'}`}></span>
							<span class="text-xl relative">{label}</span>
						</PrismicLink>
                        </div>
                        {:else}
                        <PrismicLink
                        on:click={close}
                        field={link}
                        class="group relative block overflow-hidden rounded px-3 py-1 text-base font-bold text-primary-100"
                        aria-current={isActive(link) ? 'page' : undefined}
                    >
                        <span class={`absolute inset-0 z-0 h-full rounded bg-orange-600 transition-transform duration-300 ease-in-out group-hover:translate-y-0 ${isActive(link) ? 'translate-y-[calc(100%-5px)]' : 'translate-y-[100%]'}`}></span>
                        <span class="text-xl relative">{label}</span>
                    </PrismicLink>
					{/if}
				</li>
			{/each}
            {#if profile.full_name !== undefined}
            <a href="/profile">`${profile.firstName} +" "+ ${profile.lasstName}`</a>
            {/if}
            <button class="btn variant-ghost-secondary" on:click={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
            }}>Sign Out</button>
		</ul>
	</nav>
</header>