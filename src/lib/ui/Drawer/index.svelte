<script>
	// @ts-nocheck
	import { onDestroy } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';
	import { sideBarState } from '$lib/stores/layoutStore';
	import Button from '$lib/ui/Button/index.svelte';

	const close = () => {
		drawerOpen.set(false);
	};

	onDestroy(() => {
		drawerOpen.set(false);
		// selectedOption.set(0);
	});
</script>

{#if $drawerOpen}
	<div
		class="drawer-container"
		class:drawerOpen={$drawerOpen}
		class:sideBarState={$sideBarState}
		in:slide={{ y: 800, duration: 200, quartInOut, delay: 190 }}
		out:slide={{ y: 800, duration: 200, quartInOut }}
	>
		<div class="drawer-button-container">
			<Button additionalClasses="drawer-action" action={close} label={'close'} />
		</div>
		<div class="drawer">
			<slot name="drawer-component" />
		</div>
	</div>
{/if}

<style>
	.drawer-container {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 80%;
		width: 100%;
		z-index: 1;
		display: block;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		background-color: var(--slider-drawer);
		border-top-right-radius: 15px;
		border-top-left-radius: 15px;
	}
	.drawer-container.sideBarState {
		width: calc(100% - 230px);
	}
	.drawer-container.drawerOpen {
		display: block;
	}

	.drawer {
		height: calc(100% - 56.5px);
		width: 100%;

		position: relative;
		bottom: 0;
	}
	.drawer-button-container {
		position: relative;
		top: 0;
		right: 0;
		width: calc(100% - 20px);
		height: fit-content;
		display: flex;
		justify-content: flex-end;
		padding-top: 20px;
	}
	.drawer-container .drawer-button-container :global(button.drawer-action) {
		background-color: transparent !important;
	}
	@media (min-width: 498px) {
		.drawer-container.sideBarState {
			width: calc(100% - 230px);
			left: unset;
			right: 0;
		}
	}
	/* .drawer:first-child,
	.drawer > div {
		overflow-y: scroll;
		height: 100%;
	} */
</style>
