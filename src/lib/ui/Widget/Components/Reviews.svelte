<script>
	// @ts-nocheck
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';

	let reviewData = [];
	let newReviewTextArea;
	let updating = false;
	let recommended = false;

	$: slug = $page.params.slug;

	onMount(() => {
		const init = async () => {
			reviewData = await (await fetch(`/api/reviews/getAllForGame/${slug}`)).json();
		};
		init();
	});

	function autoResize() {
		newCommentTextArea.style.height = 'fit-content';
		let textAreaCharCount = newCommentTextArea?.value?.length;
		const textAreaLineCount = newCommentTextArea?.value?.split('\n').length;
		const textAreaCalculatedLineCountByCharacters = Math.floor(
			newCommentTextArea?.style?.fontSize / newCommentTextArea?.style?.width
		);

		if (init) {
			newCommentTextArea.style.height = 'fit-content';
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else if (textAreaLineCount <= 1 && textAreaCharCount < 87) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else if (newCommentTextArea.scrollHeight <= 46 && newCommentTextArea.scrollHeight > 30) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
		} else if (newCommentTextArea.scrollHeight == 50) {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
		} else {
			newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
		}

		if (textAreaCharCount > newCommentMaxLength) {
			// dont allow more than 1500 characters
			newCommentTextArea.value = newCommentTextArea?.value?.slice(0, 1500);
			textAreaCharCount = newCommentMaxLength;
		}

		init = false;
		newCommentTotalCharacters = textAreaCharCount;
	}

	let difficultySelection;
	let selectedOption = 0;
	let selectedRatingOption;
	const difficultyOptions = [
		{ title: 'Easy', value: 1 },
		{ title: 'Medium', value: 2 },
		{ title: 'Hard', value: 3 }
	];
	const ratingOptions = ['', '⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️'];

	async function handleDifficultyChange(event) {
		await tick();
		selectedOption = event.target.value;
	}

	async function handleRatingChange(event) {
		await tick();
		selectedRatingOption = event.target.value;
	}

	// $: console.log('difficultyOptions::selectedOption', difficultyOptions[selectedOption]?.title);
</script>

<div>
	<form
		method="POST"
		action="/games/?/addReview"
		use:enhance={({ formElement, formData, action, cancel, redirect }) => {
			formData.set('gameId', slug);
			formData.set('difficulty', difficultyOptions[selectedOption]?.value);
			// formData.set('rating', ratingOptions[selectedOption]?.title);
			formData.set('recommended', recommended);
			updating = true;
			return async ({ result, update }) => {
				await update();
				setTimeout(() => {
					updating = false;
				}, 400);
				// if (result.status === 200) {
				// 	gameFavorites.set(result?.data?.body?.favorites);
				// 	gameFavoriteCount.set(result?.data?.body?.favorites?.length);
				// 	isFavorited = !isFavorited;
				// }
			};
		}}
	>
		<CustomInput
			inputCapture="reviewTitle"
			inputText="Title"
			inputValue=""
			hidden={false}
			blurAction={() => {}}
		/>
		<CustomInput
			inputCapture="reviewBody"
			inputText="Share your thoughts on this game"
			inputValue=""
			hidden={false}
			blurAction={() => {}}
		/>
		<CustomInput
			inputCapture="tags"
			inputText="Tag this game with keywords. Ensure there is a space between each keyword."
			inputValue=""
			hidden={false}
			blurAction={() => {}}
		/>
		<!-- <textarea
			placeholder="Share your thoughts on this game"
			bind:this={newReviewTextArea}
			aria-multiline="false"
			class="new-review-input"
			name={'body'}
			on:input={() => autoResize(`text-area-root`)}
		/> -->
		<select name="rating-selection" on:change={handleRatingChange}>
			{#each ratingOptions as ratingOp, i}
				<option value={i}>{ratingOp}</option>
			{/each}
		</select>
		<select name="difficulty-selection" on:change={handleDifficultyChange}>
			{#each difficultyOptions as diffOp, i}
				<option value={i}>{diffOp?.title}</option>
			{/each}
		</select>
		<ToggleSwitch bind:value={recommended} label="Recommend" design="slider" />
		<button type="submit">Add Review</button>
	</form>
</div>
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
	.new-review-input {
		height: fit-content;
		width: 100%;
		resize: none;
		box-sizing: border-box;
		padding-bottom: 8px;
		line-height: calc(1rem + 5px);
		overflow: hidden;
		background-color: transparent;
		color: var(--text-color-primary);
		font-family: 'Source Sans 3', sans-serif;
		border: 0;
		border-bottom: 2px solid rgb(66, 66, 66);
		transition: border 200ms cubic-bezier(0.55, 0.06, 0.68, 0.19);
		font-size: 1rem;
	}
	.new-review-input:focus-visible {
		outline: none;
		border-bottom: 2px solid var(--color-accent);
	}
</style>
