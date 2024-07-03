<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let reviews;
	let reviewData = [];

	$: console.log('reviewData::', reviewData);
	$: console.log('reviews::', reviews);
	$: slug = $page.params.slug;
	$: console.log('slug::', slug);

	onMount(() => {
		const init = async () => {
			reviewData = await (await fetch(`/api/reviews/getAllForGame/${slug}`)).json();
		};
		init();
	});
</script>

<!-- <h3>Reviews</h3> -->
<p>See all reviews</p>
