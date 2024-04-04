<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { modalProps, modalState, modalOpenState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { drawerOpen } from '$lib/stores/drawerStore';
	import { currentGame } from '$lib/stores/gamesStore';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import { onDestroy } from 'svelte';

	export let gameId = $modalProps?.gameId;
	export let title = $modalProps?.title;
	export let description = $modalProps?.description;
	export let thumbnail;
	export let published = $modalProps?.published;
	export let headerImage;

	let thumbnailPreview = thumbnail;

	function handleFileChange(event) {
		if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
			URL.revokeObjectURL(thumbnailPreview);
		}

		const file = event.target.files[0];
		if (file) {
			const maxSize = 127684; // this is in bytes, convert to KB
			const roundedKB = maxSize / 1000;

			if (file.size > maxSize) {
				alert(`File size (${file.size / 1000}KB) exceeds the limit of ${roundedKB}KB.`);
				return;
			}

			thumbnailPreview = URL.createObjectURL(file);
		}
	}
	onDestroy(() => {
		if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
			URL.revokeObjectURL(thumbnailPreview);
		}
	});
	//
	// "/games/?/updateDetails"
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	action="/games/{gameId}/play/?/updateDetails"
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		const gameId = formData.get('gameId');
		return async ({ result }) => {
			if (result.status === 200) {
				currentGame.set({ ...$currentGame, ...result?.data?.body?.project });
				modalOpenState.set(false);
				drawerOpen.set(false);
				await invalidateAll();
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<div class="file-input-container">
		<label class="input-label" for="thumbnail">Playlist Thumbnail</label>
		<div class="avatar">
			<input
				type="file"
				name="thumbnail"
				id="thumbnail"
				accept="image/*"
				on:change={handleFileChange}
				alt="Playlist Thumbnail Selection"
			/>
			<svg
				class="image-selection-icon"
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				fill="#000000"
				viewBox="0 0 256 256"
				><path
					d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"
				/></svg
			>
			<img
				src={thumbnailPreview ?? 'https://picsum.photos/50'}
				alt="Playlist Thumbnail Preview"
				class="photo-preview"
			/>
		</div>

		<!-- {#if profilePhotoPreview} -->

		<!-- {/if} -->
	</div>
	<CustomInput inputCapture={'published'} inputValue={published} hidden />
	<ToggleSwitch bind:value={published} label="Published" design="slider" />
	<CustomInput inputCapture={'title'} inputText={title}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'} inputText={description}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput>
	<CustomInput inputCapture={'gameId'} inputText={gameId} hidden />
	<Button label="Update Details" isRounded />
</form>

<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 30px;
		max-height: 50vh;
	}

	form.gameDetails :global(button) {
		background-color: var(--button-highlight);
		color: var(--color-primary) !important;
	}

	form.gameDetails :global(button:hover) {
		background-color: var(--button-highlight);
		/* background-color: #283e5e !important; */
	}
	.file-input-container {
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.avatar {
		position: relative;
		width: 150px;
		height: 150px;
		border-radius: 50%;
		overflow: hidden;
		margin-top: 30px;
	}
	.photo-preview {
		width: 20em;
		max-width: 200px;
		max-height: 200px;
		object-fit: cover;
	}
	#thumbnail {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	#thumbnail:hover {
		cursor: pointer;
	}
	.image-selection-icon {
		position: absolute;
		width: 32px;
		height: 32px;
		fill: #ffffff;
		bottom: calc(50% - 16px);
		right: calc(50% - 16px);
	}
</style>
