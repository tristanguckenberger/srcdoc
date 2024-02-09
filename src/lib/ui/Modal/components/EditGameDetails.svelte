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

	export let gameId = $modalProps?.gameId;
	export let title = $modalProps?.title;
	export let description = $modalProps?.description;
	export let published = $modalProps?.published;
	export let headerImage;
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	action="/games/?/updateDetails"
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
</style>
