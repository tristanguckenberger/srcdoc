<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { onDestroy, tick } from 'svelte';
	import { modalProps, modalState, modalOpenState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { invalidateAll } from '$app/navigation';
	import { drawerOpen } from '$lib/stores/drawerStore';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	let {
		id = $modalProps?.id,
		username = $modalProps?.username,
		profile_photo = $modalProps?.profile_photo,
		bio = $modalProps?.bio
	} = $props();

	let profilePhotoPreview = $state(profile_photo); // Assuming 'profile_photo' is the current photo URL
	let fileObj = $state();

	function handleFileChange(event) {
		if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) {
			URL.revokeObjectURL(profilePhotoPreview);
		}

		const file = event.target.files[0];

		if (file) {
			profilePhotoPreview = URL.createObjectURL(file);
			fileObj = file;
			console.log('file::', file);
		}
	}

	onDestroy(() => {
		if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) {
			URL.revokeObjectURL(profilePhotoPreview);
		}
	});
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	action={`/users/${id}/?/updateUserDetails`}
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		formData.set('profilePhoto', fileObj);
		return async ({ result, update }) => {
			await update();
			if (result.status === 200) {
				modalOpenState.set(false);
				drawerOpen.set(false);
				await invalidateAll();
			}
		};
	}}
>
	<div class="hide">
		<CustomInput inputCapture={'id'} inputText={id} hidden />
	</div>
	<div class="file-input-container">
		<label for="profilePhoto">Profile Photo</label>
		<div class="avatar">
			<input
				type="file"
				name="profilePhoto"
				id="profilePhoto"
				accept="image/*"
				onchange={handleFileChange}
				alt="Profile Avatar Selection"
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
			{#if profilePhotoPreview}
				<img
					src={profilePhotoPreview ?? 'https://picsum.photos/50'}
					alt="Profile Avatar Preview"
					class="photo-preview"
				/>
			{:else}
				<div class="photo-preview">
					<ImagePlaceHolder />
				</div>
			{/if}
		</div>
	</div>
	<div>
		<label for="username">Username</label>
		<CustomInput inputCapture={'username'} inputText={username} />
	</div>
	<div>
		<label for="bio">Bio</label>
		<CustomInput inputCapture={'bio'} inputText={bio} />
	</div>

	<Button label="Update User Details" isRounded />
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
	label {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		color: var(--color-primary);
	}
	form.gameDetails :global(button) {
		background-color: var(--button-highlight);
		color: var(--color-primary) !important;
	}

	form.gameDetails :global(button:hover) {
		background-color: var(--button-highlight);
		/* background-color: #283e5e !important; */
	}

	/* File Upload styles */
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
		overflow: hidden;
	}
	.input-label {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		color: var(--color-primary);
	}
	#profilePhoto {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	#profilePhoto:hover {
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
	.hide {
		height: 0 !important;
		width: 0 !important;
		position: absolute;
	}
</style>
