<script>
	// @ts-nocheck
	import { afterUpdate, onMount } from 'svelte';
	import { sideBarState } from '$lib/stores/layoutStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import { enhance } from '$app/forms';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';

	export let userId;
	export let userSettings;
	export let action;

	const settingsStore = writable(null);
	let hidePopUpInfo = false;
	let darkMode = false;
	let updating = false;

	const getSettings = async () => {
		const settingsRes = await fetch(`/api/settings/byUser/get`);
		const settings = await settingsRes.json();

		return settings;
	};

	onMount(async () => {
		console.log('Settings mounted');
		console.log('userId:', userId);
		console.log('userSettings:', userSettings);
		if (browser && userId) {
			const settingsRes = await getSettings(userId, fetch);

			if (settingsRes) {
				settingsStore.set(settingsRes);
			}
			if ($settingsStore) {
				hidePopUpInfo = $settingsStore?.hidePopUpInfo ?? $settingsStore?.hide_pop_up_info;
				darkMode = $settingsStore?.darkMode ?? $settingsStore?.dark_mode;
			}
		}
	});

	afterUpdate(() => {
		console.log('$settingsStore::', $settingsStore);
	});

	$: themeString = $themeDataStore?.theme?.join(' ');
	$: console.log('darkMode::', darkMode);
</script>

<div class="settings-container" class:sideBarOpen={$sideBarState} style={themeString}>
	<h1>Settings</h1>
	<button class="close" on:click={action}>Close</button>
	<form
		class="settingsForm"
		method="POST"
		action="/?/updateSettings"
		enctype="multipart/form-data"
		use:enhance={() => {
			updating = true;

			return async ({ update }) => {
				await update();
				setTimeout(() => {
					updating = false;
				}, 500);
			};
		}}
	>
		<CustomInput inputCapture={'hidePopUpInfo'} inputValue={hidePopUpInfo} hidden />
		<ToggleSwitch bind:value={hidePopUpInfo} label="Hide Pop-Up Info" design="slider" />
		<CustomInput inputCapture={'darkMode'} inputValue={darkMode} hidden />
		<ToggleSwitch bind:value={darkMode} label={'Dark Mode'} design="slider" />
		<Button
			bind:creating={updating}
			label="Update Details"
			isRounded
			style="background-color: #6495ED;"
		/>
	</form>
</div>

<style>
	.settings-container {
		position: absolute;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		width: 100%;
		height: calc(100% - 56px);
		bottom: 0;
		right: 0;
		background-color: var(--color-secondary);
		flex-direction: column;
		gap: 10px;
	}
	.settings-container h1 {
		margin: 20px 20px 0 20px;
		font-family: 'Source Sans 3', sans-serif;
		color: var(--color-primary);
		/* text-decoration: underline; */
		margin-block-end: 0;
	}
	.settings-container.sideBarOpen {
		width: calc(100% - 230px);
	}
	.settingsForm {
		display: flex;
		flex-direction: column;
		height: 100%;
		margin: 0 20px 20px 20px;
	}
	.settingsForm :global(.s.s--slider) {
		margin-bottom: 20px;
	}
	.settingsForm :global(span) {
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
		font-family: var(--paragraph-font), sans-serif;
	}
	button.close {
		background-color: transparent;
		position: absolute;
		top: 20px;
		right: 20px;
		border: none;
		font-size: 1.5vmin;
		font-family: 'Source Sans 3';
		font-weight: 650;
		color: var(--vibrant-blue);
		z-index: 10000;
	}
	button.close:hover {
		cursor: pointer;
	}
</style>
