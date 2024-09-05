<script>
	// @ts-nocheck
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

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

	// function autoResize() {
	// 	newCommentTextArea.style.height = 'fit-content';
	// 	let textAreaCharCount = newCommentTextArea?.value?.length;
	// 	const textAreaLineCount = newCommentTextArea?.value?.split('\n').length;
	// 	const textAreaCalculatedLineCountByCharacters = Math.floor(
	// 		newCommentTextArea?.style?.fontSize / newCommentTextArea?.style?.width
	// 	);

	// 	if (init) {
	// 		newCommentTextArea.style.height = 'fit-content';
	// 		newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
	// 	} else if (textAreaLineCount <= 1 && textAreaCharCount < 87) {
	// 		newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
	// 	} else if (newCommentTextArea.scrollHeight <= 46 && newCommentTextArea.scrollHeight > 30) {
	// 		newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
	// 	} else if (newCommentTextArea.scrollHeight == 50) {
	// 		newCommentTextArea.style.height = newCommentTextArea.scrollHeight - 20 + 'px';
	// 	} else {
	// 		newCommentTextArea.style.height = newCommentTextArea.scrollHeight + 'px';
	// 	}

	// 	if (textAreaCharCount > newCommentMaxLength) {
	// 		// dont allow more than 1500 characters
	// 		newCommentTextArea.value = newCommentTextArea?.value?.slice(0, 1500);
	// 		textAreaCharCount = newCommentMaxLength;
	// 	}

	// 	init = false;
	// 	newCommentTotalCharacters = textAreaCharCount;
	// }

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
	const buttonStyle = `display: flex;
    flex-direction: row;
    gap: 25px;
    color: var(--color-primary);
    padding-block: 0;
    border-width: 0;
    border-top-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 0px;
    border-left-width: 0px;
    border-radius: 4px;
    padding: 10px;
    margin-right: 10px;
    text-decoration: none;
    font-size: 0.9rem;
    font-family: var(--action-font) !important;
    text-wrap: nowrap;
    border-style: none !important;
    display: flex;
    align-items: center;
    max-height: 36.5px;
    height: 16.5px;
	min-height: 36.5px;
	background-color: var(--button-blue);
    font-weight: 500;
	cursor: pointer;
	width: fit-content;`;

	let showNewReviewForm = false;
	const toggleNewReviewForm = () => {
		showNewReviewForm = !showNewReviewForm;
	};
</script>

<div class="form-container" class:showNewReviewForm>
	{#if showNewReviewForm}
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
			<div>
				<label for="reviewTitle">Title</label>
				<CustomInput
					inputCapture="reviewTitle"
					inputText=""
					placeholder="Title"
					inputValue=""
					hidden={false}
					blurAction={() => {}}
				/>
			</div>

			<div>
				<label for="reviewBody">Body</label>
				<CustomInput
					inputCapture="reviewBody"
					inputText=""
					placeholder="Share your thoughts on this game"
					inputValue=""
					hidden={false}
					blurAction={() => {}}
				/>
			</div>

			<div>
				<label for="tags">Tags</label>
				<CustomInput
					inputCapture="tags"
					inputText=""
					placeholder="Tag this game with keywords. Ensure there is a space between each keyword."
					inputValue=""
					hidden={false}
					blurAction={() => {}}
				/>
			</div>
			<div class="select-container">
				<div>
					<label for="rating-selection">Rating</label>
					<select name="rating-selection" on:change={handleRatingChange}>
						{#each ratingOptions as ratingOp, i}
							<option value={i}>{ratingOp}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="difficulty-selection">Difficulty</label>
					<select name="difficulty-selection" on:change={handleDifficultyChange}>
						{#each difficultyOptions as diffOp, i}
							<option value={i}>{diffOp?.title}</option>
						{/each}
					</select>
				</div>
			</div>
			<ToggleSwitch bind:value={recommended} label="Recommend" design="slider" />
			<Button bind:creating={updating} label="Add Review" style={buttonStyle} />
		</form>
		<span class="cancel" on:click={toggleNewReviewForm}>Cancel</span>
	{:else}
		<button on:click={toggleNewReviewForm} style={buttonStyle}>Add Review</button>
	{/if}
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
									<span class="timestamp"
										>Posted: {new Date(review.updated_at).toLocaleString()}</span
									>
								</div>
								|
								<div class="review-header-left-top-right">
									{#if review?.profile_photo}
										<img class="profile-photo" src={review.profile_photo} alt={review.username} />
									{:else}
										<div class="profile-photo">
											<ImagePlaceHolder />
										</div>
									{/if}
									<span>{review.username}</span>
								</div>
							</div>
							<div class="review-header-left-bottom" />
						</div>
						<div class="review-header-right">
							<div class="recommendation">
								<span class="rec-text" class:recommended={review.recommended}>
									{#if review.recommended}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32Z"
											/></svg
										>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Z"
											/></svg
										>
									{/if}
								</span>
								|
								<span>{review.rating}/5</span>
							</div>
						</div>
					</div>
					<div class="review-body">
						<h2>{review.title}</h2>
						<p>{review.body}</p>
					</div>
				</div>
				<div class="tag-container">
					<h3 class="tag-title">Tags:</h3>
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
		margin-block-start: 2rem;
	}
	.form-container {
		padding: 20px;
		gap: 20px;
		background: #26282a;
		border-radius: 8px;
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-between;
	}

	.form-container form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		flex-grow: 5;
	}

	.review-container {
		display: flex;
		flex-direction: column;
		/* padding: 8px; */
		background-color: var(--menu-bg);
		border-radius: 8px;
	}
	.select-container {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.select-container div {
		display: flex;
		flex-direction: column;
	}

	.review {
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		padding: 20px;
		background-color: #26282a;
		color: var(--color-primary);
		min-height: fit-content;
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
		flex-direction: row-reverse;
		gap: 10px;
		align-items: center;
	}

	.review-header-left-top-left {
		margin-right: 10px;
	}

	.review-header-left-top-right .profile-photo {
		border-radius: 50%;
		width: 23.5px;
		height: 23.5px;
		object-fit: cover;
		border: 2px solid #a69160;
		color: #e3f1f6;
		overflow: hidden;
	}

	.review-header-left-top-right span {
		font-size: 1rem;
		font-family: var(--action-font) !important;
	}

	.review-header-left-top-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 7px;
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
		margin-top: 30px;
		font-family: 'Source Sans 3', sans-serif;
	}
	.review-body h2 {
		font-size: 1.5rem;
		font-family: 'Source Sans 3', sans-serif;
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.review-body p {
		margin-block-start: 8px;
	}
	.tag-container {
		flex-direction: row;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 20px;
		align-items: center;
	}
	.tag-container .tag-title {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1.2rem;
		color: var(--color-primary);
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.chip {
		background-color: var(--button-blue-hover);
		color: var(--color-primary);
		padding: 6px 12px;
		border-radius: 50px;
		height: fit-content;
		max-height: 36px;
		width: auto;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		font-family: 'Source Sans 3', sans-serif;
	}
	.timestamp {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 0.8rem;
	}
	.recommendation {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.recommendation span {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1.2rem;
		color: var(--color-primary);
		display: flex;
	}
	.recommendation .rec-text svg {
		fill: #da3535;
	}

	.recommendation .rec-text.recommended svg {
		fill: #376597;
	}
	label {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		color: var(--color-primary);
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
	.form-container :global(.s--slider span) {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		color: var(--color-primary);
	}
	span.cancel {
		width: fit-content;
		height: fit-content;
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		color: var(--color-primary);
		cursor: pointer;
		align-self: self-end;
	}
</style>
