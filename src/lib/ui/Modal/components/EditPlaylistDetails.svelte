<script>
	// @ts-nocheck
	import { invalidateAll } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { drawerOpen } from '$lib/stores/drawerStore';

	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	export let playlistId;
	export let name;
	export let description;
	export let isPublic;
	export let action = '?/createPlaylist';
	export let fromLayout = false;

	$: label = fromLayout ? 'Create Playlist' : 'Update Details';
	$: action = fromLayout ? '?/createPlaylist' : '/playlists/?/updatePlaylist';
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
	<ToggleSwitch bind:value={isPublic} label="Public" design="slider" />
	<CustomInput inputCapture={'is_public'} inputValue={isPublic} hidden />
	<CustomInput inputCapture={'name'} inputText={name}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'} inputText={description}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput>
	{#if playlistId}
		<CustomInput inputCapture={'playlistId'} inputText={`${playlistId}`} hidden />
	{/if}
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
