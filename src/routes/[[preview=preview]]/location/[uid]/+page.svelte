<script>
	import { SliceZone } from '@prismicio/svelte';
	import { PrismicImage, PrismicText } from '@prismicio/svelte';
	import { components } from '$lib/slices';
	import Bounded from '$lib/components/Bounded.svelte';
	export let data;
</script>

<SliceZone slices={data.page.data.slices} {components} />