<script>
	// @ts-nocheck
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';

	import {
		guiEditorSidebarOpen,
		guiEditorSidebarWidth,
		fileSystemSidebarOpen,
		docsOpen,
		areaHeight
	} from '$lib/stores/filesStore.js';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';

	let ctx = $props();
	let showToolTip = $state(false);
	let previousRoute = $derived($routeHistoryStore[$routeHistoryStore.length - 2]);
</script>

<div
	class={{ sidebar: 'sidebar', hidden: !$fileSystemSidebarOpen, docsOpen: $docsOpen }}
	bind:clientWidth={$guiEditorSidebarWidth}
	bind:clientHeight={$areaHeight}
>
	<div class="action-row">
		<a aria-label="docs-icon" href={previousRoute} class="docs-button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				fill="#000000"
				viewBox="0 0 256 256"
				><path
					d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
				/></svg
			>
		</a>
		<button
			aria-label="open docs"
			class="docs-button"
			onclick={() => {
				$docsOpen = !$docsOpen;
				showToolTip = false;
			}}
		>
			<div
				role="tooltip"
				class="icon-tooltip-container"
				onmouseover={() => {
					showToolTip = true;
				}}
				onmouseleave={() => {
					showToolTip = false;
				}}
				onfocus={() => {}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M213.66,66.34l-40-40A8,8,0,0,0,168,24H88A16,16,0,0,0,72,40V56H56A16,16,0,0,0,40,72V216a16,16,0,0,0,16,16H168a16,16,0,0,0,16-16V200h16a16,16,0,0,0,16-16V72A8,8,0,0,0,213.66,66.34ZM168,216H56V72h76.69L168,107.31v84.53c0,.06,0,.11,0,.16s0,.1,0,.16V216Zm32-32H184V104a8,8,0,0,0-2.34-5.66l-40-40A8,8,0,0,0,136,56H88V40h76.69L200,75.31Zm-56-32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,152Zm0,32a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h48A8,8,0,0,1,144,184Z"
					/></svg
				>
			</div></button
		>
		{#if showToolTip}
			<ToolTip text="Open/Close Editor Docs" position="bottom" />
		{/if}
	</div>

	<hr class="sidebar-divider" />
	{#if $docsOpen}
		<Documentation parentHeight={$areaHeight} />
	{/if}
</div>

<style>
	.sidebar {
		padding: 10px;
		border-radius: 6px;
		border: 2px solid #5c5c5c;
		overflow: hidden;
		max-width: 245px;
	}

	.sidebar.docsOpen {
		max-width: 50% !important;
	}

	@media (min-width: 498px) {
		:global(.engineInRoute) .sidebar {
			height: calc(100% + 16px);
			bottom: 40px;
		}
		:global(.engineInRoute.noOpenTabs) .sidebar {
			height: calc(100% - 24px);
			bottom: 0px;
		}
	}

	.sidebar.hidden {
		display: none;
	}
	button.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
	}
	a.docs-button svg,
	button.docs-button svg {
		width: 23px;
		height: 23px;
		fill: var(--color-primary);
	}
	a.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
		justify-content: center;
	}
	div.action-row {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
	}
	.icon-tooltip-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000000000000;
	}
	.action-row :global(.tooltip__container.bottom) {
		top: 51px !important;
		bottom: unset;
	}
	.sidebar {
		padding: 10px;
		border-radius: 6px;
		border: 2px solid #5c5c5c;
		overflow: hidden;
		max-width: 245px;
	}
	.sidebar.docsOpen {
		max-width: 50% !important;
	}
</style>
