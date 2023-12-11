<script>
	// @ts-nocheck
	import {
		modalState,
		modalOpenState,
		modalComponent,
		modalProps,
		modalStateStore
	} from '$lib/stores/layoutStore.js';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { onMount } from 'svelte';

	$: themeString = $themeDataStore?.theme?.join(' ');
	$: Component = $modalStateStore?.modalComponent;
	$: PROPS = $modalState?.modalProps;

	let initializing = true;

	onMount(() => {
		setTimeout(() => {
			initializing = false;
		}, 1000);
	});
</script>

<svelte:document
	on:click={(e) => {
		if (initializing) return;
		if (
			!e.target.classList.contains('modal') &&
			e.target.name !== 'title' &&
			e.target.name !== 'description' &&
			e.target.type !== 'submit'
		) {
			const checkUser = confirm('Are you sure you want to close this modal?');
			if (checkUser) {
				modalOpenState.set(false);
				// modalComponent.set(null);
				// modalProps.set(null);
				// modalStateStore.set(null);
			}
		}
	}}
/>

<div class="modal" class:sideBarOpen={$sideBarState} style={themeString}>
	<Component {...PROPS} />
</div>

<style>
	.modal {
		position: fixed;
		z-index: 1000;
		width: 50%;
		height: 50%;
		background-color: var(--button-highlight);
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		justify-self: center;
		align-self: center;
		border-radius: 6px;
		height: fit-content;
		max-height: 50vh;
	}
	.modal.sideBarOpen {
		left: calc(25% + 230px / 2);
	}
</style>
