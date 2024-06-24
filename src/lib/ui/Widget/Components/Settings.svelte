<script>
	// @ts-nocheck
	import { onMount, tick } from 'svelte';
	import { sideBarState } from '$lib/stores/layoutStore';
	import { themeDataStore, themeKeyStore } from '$lib/stores/themeStore';
	import ToggleSwitch from '$lib/ui/ToggleSwitch/index.svelte';
	import { enhance } from '$app/forms';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { settingsStore } from '$lib/stores/settingsStore';
	import { invalidateAll } from '$app/navigation';
	import {
		editorPageInfoStore,
		gamePageInfoStore,
		homePageInfoStore
	} from '$lib/stores/InfoStore.js';
	import { setContext, getContext } from 'svelte';
	import AccountTab from '$lib/ui/SettingsTabs/AccountTab.svelte';
	import AppearanceTab from '$lib/ui/SettingsTabs/AppearanceTab.svelte';
	import EditorTab from '$lib/ui/SettingsTabs/EditorTab.svelte';
	import PrivacyAndSecurityTab from '$lib/ui/SettingsTabs/PrivacyAndSecurityTab.svelte';
	import NotificationsTab from '$lib/ui/SettingsTabs/NotificationsTab.svelte';
	import ActivityAndDataTab from '$lib/ui/SettingsTabs/ActivityAndDataTab.svelte';
	import TabComponentPicker from '$lib/ui/TabComponentPicker/index.svelte';
	import EditUserDetails from '$lib/ui/Modal/components/EditUserDetails.svelte';
	import GeneralTab from '$lib/ui/SettingsTabs/GeneralTab.svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import Follows from '$lib/ui/Follows/index.svelte';

	export let userId;
	export let userSettings;
	export let action;
	export let followers;
	export let following;

	let hidePopUpInfoHome = false;
	let hidePopUpInfoGames = false;
	let hidePopUpInfoEditor = false;
	let darkMode = true;
	let updating = false;
	let themeString = '';

	const getSettings = async () => {
		const settingsRes = await fetch(`/api/settings/byUser/get`);
		const settings = await settingsRes.json();

		return settings;
	};

	setContext('settingsTabs', {
		tabs: [
			// { name: 'Account', component: AccountTab },
			{ name: 'General', component: GeneralTab },
			{ name: 'Followers/Following', component: Follows }
			// { name: 'Privacy & Security', component: PrivacyAndSecurityTab },
			// { name: 'Notifications', component: NotificationsTab },
			// { name: 'Activity & Data', component: ActivityAndDataTab }
		],
		currentTab: writable(0)
	});

	const { tabs, currentTab } = getContext('settingsTabs');

	onMount(() => {
		const init = async () => {
			if (browser && userId) {
				const settingsRes = await getSettings();

				if (settingsRes) {
					settingsStore.set(settingsRes);
				}
				if ($settingsStore) {
					hidePopUpInfoHome = $settingsStore?.hide_pop_up_info_home;
					hidePopUpInfoGames = $settingsStore?.hide_pop_up_info_games;
					hidePopUpInfoEditor = $settingsStore?.hide_pop_up_info_editor;
				}
			}
		};
		init();
	});

	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

Settings

<div class="settings-container" class:sideBarOpen={$sideBarState} style={themeString}>
	<h1>Settings</h1>
	<button class="close" on:click={action}>Close</button>
	<TabComponentPicker />

	<svelte:component this={tabs[$currentTab]?.component}>
		<div slot="tab_form_elements">
			<CustomInput inputCapture={'darkMode'} inputValue={true} hidden />
			{#if $currentTab === 0}
				<form
					class="settingsForm"
					method="POST"
					action="/?/updateSettings"
					enctype="multipart/form-data"
					use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
						formData.set('hidePopUpInfoHome', hidePopUpInfoHome);
						formData.set('hidePopUpInfoGames', hidePopUpInfoGames);
						formData.set('hidePopUpInfoEditor', hidePopUpInfoEditor);
						formData.set('darkMode', darkMode);

						updating = true;

						return async ({ update, result }) => {
							await update();
							setTimeout(() => {
								updating = false;
							}, 500);

							if (result?.status === 200) {
								console.log(result?.data?.body?.result);
								await tick();
								homePageInfoStore.set({
									...$homePageInfoStore,
									viewed: Boolean(result?.data?.body?.result?.hide_pop_up_info_home)
								});
								gamePageInfoStore.set({
									...$gamePageInfoStore,
									viewed: Boolean(result?.data?.body?.result?.hide_pop_up_info_games)
								});
								editorPageInfoStore.set({
									...$editorPageInfoStore,
									viewed: Boolean(result?.data?.body?.result?.hide_pop_up_info_editor)
								});
								await invalidateAll();
							}
						};
					}}
				>
					<CustomInput inputCapture={'hidePopUpInfoHome'} inputValue={hidePopUpInfoHome} hidden />
					<ToggleSwitch
						bind:value={hidePopUpInfoHome}
						label="Disable Home Tutorial Pop-up"
						design="slider"
					/>
					<CustomInput inputCapture={'hidePopUpInfoGames'} inputValue={hidePopUpInfoGames} hidden />
					<ToggleSwitch
						bind:value={hidePopUpInfoGames}
						label="Disable Game Tutorial Pop-up"
						design="slider"
					/>
					<CustomInput
						inputCapture={'hidePopUpInfoEditor'}
						inputValue={hidePopUpInfoEditor}
						hidden
					/>
					<ToggleSwitch
						bind:value={hidePopUpInfoEditor}
						label="Disable Editor Tutorial Pop-up"
						design="slider"
					/>
					<Button
						bind:creating={updating}
						label="Update Details"
						isRounded
						style="background-color: #6495ED; margin-top: 60px;"
					/>
				</form>
			{:else if $currentTab === 1}
				<!-- <Follows userId={$platformSession?.currentUser?.id} /> -->
				<!--
                    <ToggleSwitch bind:value={hidePopUpInfo} label="Editor" design="slider" /> -->
				<!-- {:else if $currentTab === 2} -->
				<!-- <ToggleSwitch bind:value={hidePopUpInfo} label="Privacy & Security" design="slider" />
                {:else if $currentTab === 3}
                    <ToggleSwitch bind:value={hidePopUpInfo} label="Notifications" design="slider" />
                {:else if $currentTab === 4}
                    <ToggleSwitch bind:value={hidePopUpInfo} label="Activity & Data" design="slider" /> -->
			{/if}
		</div>
	</svelte:component>
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
