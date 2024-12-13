<script lang="ts">

	import { PrismicRichText , PrismicText} from '@prismicio/svelte';
	import GoldText from '$lib/components/GoldText.svelte';
	import Bounded from '$lib/components/Bounded.svelte';
	import type { Content } from '@prismicio/client';
	import GridAndDotBackgrounds from '$lib/components/ui/GridAndDotBackground/GridAndDotBackgrounds.svelte';
	export let slice:Content.SparkleSlice;
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	
	<div class="hero__glow hero__image glass-container mx-auto mt-16 w-full ">

		<div class="hero__glow--one  absolute left-1/3 top-0 -z-10 h-2/3 w-2/3 bg-yellow-400/50 mix-blend-screen blur-[120px] filter"/>
		<div class="hero__glow--two absolute left-0 top-1/3 -z-10 h-2/3 w-2/3 bg-orange-600/50 mix-blend-screen blur-[120px] filter"/>
		<h1 class="hero__glow hero__heading text-balance text-center text-5xl font-medium max-w-3xl mx-auto  md:text-7xl">
			
			<PrismicRichText field={slice.primary.heading} components={{em:GoldText}}/>
		</h1>
	
		<p class="mx-auto mt-12 prose prose-invert prose-2xl">
			<PrismicText  field={slice.primary.body}/>
		</p>
	</div>
	
</Bounded>
