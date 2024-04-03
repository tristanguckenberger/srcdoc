<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { onDestroy } from 'svelte';
	import { modalProps, modalState, modalOpenState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { invalidateAll } from '$app/navigation';
	import { drawerOpen } from '$lib/stores/drawerStore';

	export let id = $modalProps?.id;
	export let username = $modalProps?.username;
	export let profile_photo = $modalProps?.profile_photo;
	export let bio = $modalProps?.bio;

	let profilePhotoPreview = profile_photo; // Assuming 'profile_photo' is the current photo URL

	function handleFileChange(event) {
		console.log('event::', event);
		console.log('event::', event.target);
		console.log('event::', event.target.files[0]);
		if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) {
			URL.revokeObjectURL(profilePhotoPreview);
		}

		const file = event.target.files[0];

		if (file) {
			profilePhotoPreview = URL.createObjectURL(file);
		}
	}

	onDestroy(() => {
		if (profilePhotoPreview && profilePhotoPreview.startsWith('blob:')) {
			URL.revokeObjectURL(profilePhotoPreview);
		}
	});

	$: console.log('id::', id);
	$: console.log('username::', username);
	$: console.log('profile_photo::', profile_photo);
	$: console.log('bio::', bio);
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	action={`/users/${id}/?/updateUserDetails`}
	enctype="multipart/form-data"
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		console.log('editUser::formData::', formData);
		return async ({ result }) => {
			if (result.status === 200) {
				// currentGame.set({ ...$currentGame, ...result?.data?.body?.project });
				modalOpenState.set(false);
				drawerOpen.set(false);
				await invalidateAll();
			} else {
				// await applyAction(result);
			}
		};
	}}
>
	<div class="hide">
		<CustomInput inputCapture={'id'} inputText={id} hidden />
	</div>

	<!-- <CustomInput inputCapture={'profile_photo'} inputText={profile_photo} hidden /> -->
	<div class="file-input-container">
		<label class="input-label" for="profilePhoto">Profile Photo</label>
		<div class="avatar">
			<input
				type="file"
				name="profilePhoto"
				id="profilePhoto"
				accept="image/*"
				on:change={handleFileChange}
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
			<img
				src={profilePhotoPreview ?? 'https://picsum.photos/50'}
				alt="Profile Avatar Preview"
				class="photo-preview"
			/>
		</div>

		<!-- {#if profilePhotoPreview} -->

		<!-- {/if} -->
	</div>
	<CustomInput inputCapture={'username'} inputText={username}>
		<span slot="label" class="input-label modal">Username</span>
	</CustomInput>
	<CustomInput inputCapture={'bio'} inputText={bio}>
		<span slot="label" class="input-label modal">Bio</span>
	</CustomInput>

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
	}
	.input-label {
		font-weight: 500;
		font-size: 1rem;
		font-family: var(--header-font), sans-serif;
		color: var(--color-primary);
		align-self: flex-start;
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
