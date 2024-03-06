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

	export let name;
	export let description;
	export let isPublic;
	export let action = '?/createPlaylist';
	export let fromLayout = false;

	const createNewPlaylist = () => {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append('isPublic', isPublic);

		console.log('formData::name::', name);
		console.log('formData::description::', description);
		console.log('formData::isPublic::', isPublic);
		// fetch(action, {
		// 	method: 'POST',
		// 	body: formData
		// })
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		if (data.status === 200) {
		// 			drawerOpen.set(false);
		// 			invalidateAll();
		// 		} else {
		// 			applyAction(data);
		// 		}
		// 	});
	};

	$: label = fromLayout ? 'Create Playlist' : 'Update Details';
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	{action}
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		return async ({ result }) => {
			if (result.status === 200) {
				drawerOpen.set(false);
				await invalidateAll();
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<CustomInput inputCapture={'isPublic'} inputValue={isPublic} hidden />
	<ToggleSwitch bind:value={isPublic} label="Public" design="slider" />
	<CustomInput inputCapture={'name'} inputText={name}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'} inputText={description}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput>
	<Button {label} isRounded />
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
</style>
