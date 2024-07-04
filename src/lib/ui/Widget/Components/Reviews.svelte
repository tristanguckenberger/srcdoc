<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let reviews = [];
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
<div class="reviews-container">
	{#if reviewData?.length > 0}
		{#each reviewData as review}
			<div class="review-container" class:recommended={review.recommended}>
				<div class="review">
					<div class="review-header">
						<div class="review-header-left">
							<div class="review-header-left-top">
								<div class="review-header-left-top-left">
									<p>{review.updated_at}</p>
								</div>
								<div class="review-header-left-top-right">
									<img src={review.profile_photo} alt={review.username} />
									<h4>{review.username}</h4>
								</div>
							</div>
							<div class="review-header-left-bottom" />
						</div>
						<div class="review-header-right">
							<p>{review.recommended ? 'Recommended' : 'Not Recommended'} | {review.rating}/5</p>
						</div>
					</div>
					<div class="review-body">
						<h2>{review.title}</h2>
						<p>{review.body}</p>
					</div>
				</div>
				<div class="tag-container">
					{#each review.tags as tag}
						<span class="chip">{tag.name}</span>
					{/each}
				</div>
			</div>
		{/each}
	{:else}
		<p>No reviews found</p>
	{/if}
</div>

<style>
	.reviews-container {
		display: flex;
		flex-direction: column;
	}

	.review-container {
		display: flex;
		/* flex-direction: column; */
		padding: 4px;
		background-color: #2f842f;
		border-radius: 8px;
	}
	.tag-container {
		display: flex;
		flex-direction: row;
		max-width: 40%;
		/* max-height: 100%; */
		/* overflow-x: hidden;
		overflow-y: scroll; */
		height: 100%;
	}
	.review {
		border-radius: 4px;
		padding: 10px;
		background-color: var(--slider-drawer);
		color: var(--color-primary);
	}

	.review-header {
		display: flex;
		justify-content: space-between;
	}

	.review-header-left {
		display: flex;
		flex-direction: column;
	}

	.review-header-left-top {
		display: flex;
		flex-direction: column;
	}

	.review-header-left-top-left {
		margin-right: 10px;
	}

	.review-header-left-top-right img {
		border-radius: 50%;
		height: 50px;
		width: 50px;
	}

	.review-header-left-top-right {
		display: flex;
		flex-direction: row;
	}

	.review-header-left-bottom {
		display: flex;
		justify-content: center;
	}

	.review-header-right {
		display: flex;
		justify-content: center;
	}

	.review-body {
		margin-top: 10px;
	}
	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 6px 10px;
		max-height: 46px;
	}

	.chip {
		background-color: var(--color-secondary);
		color: var(--color-primary);
		padding: 4px 8px;
		border-radius: 50px;
		height: fit-content;
		max-height: 36px;
		width: auto;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
