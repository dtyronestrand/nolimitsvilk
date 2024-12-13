<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';
import GoldText from '$lib/components/GoldText.svelte';
import Heading1 from '$lib/components/Heading1.svelte';
import Heading2 from '$lib/components/Heading2.svelte';
	export let slice: Content.RichTextSlice;
</script>

<section class="mx-auto text-primary-50 prose prose-invert prose-xl">
	<PrismicRichText 
		field={slice.primary.content}
		components={{
			em:GoldText, heading1:Heading1, heading2:Heading2
		}}
	/>
</section>

