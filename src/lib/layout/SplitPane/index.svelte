<svelte:options accessors />

<script>
	// @ts-nocheck
	import { afterUpdate, onDestroy } from 'svelte';
	import { clearSplit, splitInstanceStore, editorSplit } from '$lib/stores/splitStore';
	import Split from 'split.js';
	import { paneMinHeightModifier } from '$lib/stores/layoutStore';
	import {
		fileSystemSidebarOpen,
		fileSystemSidebarWidth,
		openInNewPane
	} from '$lib/stores/filesStore';
	import { splitStore } from '$lib/stores/splitStore';
	import { clientWidth } from '$lib/stores/layoutStore copy';

	/**
	 * @type {any[]}
	 */
	export let panes;

	/**
	 * @type {null}
	 */
	export let sizes = null;

	/**
	 * @type {boolean}
	 */
	export let vertical = false;

	/**
	 * @type {Split.Instance}
	 */
	let splitInstance;

	$: paneIDs = panes?.map((pane) => (typeof pane === 'string' ? pane : pane?.paneID));

	const reloadSplit = () => {
		// Destory existing splitInstance
		if (splitInstance) splitInstance?.destroy(true, false);

		if (!paneIDs || paneIDs?.length === 0) return;

		// Init a new split instance
		splitInstance = Split(paneIDs, {
			direction: vertical ? 'vertical' : 'horizontal',
			gutterSize: 10,
			// @ts-ignore
			sizes,
			minSize: $paneMinHeightModifier
		});

		splitStore.set(splitInstance);
	};

	/**
	 * @type {HTMLDivElement | null}
	 */
	let split;

	$: $fileSystemSidebarOpen,
		(() => {
			clearSplit.set(true);
		})();

	afterUpdate(() => {
		if ($clearSplit) {
			reloadSplit();
			setTimeout(() => {
				clearSplit?.set(false);
				openInNewPane.set(false);
			}, 100);
		}
	});

	onDestroy(() => {
		split = null;
		splitInstance?.destroy();
	});

	// Replaces functionality found in onMount
	$: if (split) {
		panes?.map(async (query) => {
			const queryString = typeof query === 'string' ? query : query?.paneID;
			const splitDom = await split?.querySelector(queryString);
			splitDom?.classList?.add('pane');
		});

		// Init Split.js
		setTimeout(() => reloadSplit(), 50);
	}

	$: if (splitInstance && splitInstance?.getSizes()?.length > 2 && !$editorSplit) {
		editorSplit.set(splitInstance);
	}

	$: if (splitInstance && splitInstance?.getSizes()?.length <= 2 && !$splitInstanceStore) {
		splitInstanceStore.set(splitInstance);
	}

	$: isSideBarOpen = $fileSystemSidebarOpen;
</script>

<div
	class="split {vertical ? 'vertical' : ''}"
	bind:this={split}
	style="--sidebar-width: {isSideBarOpen ? $fileSystemSidebarWidth + 32 : 38}px;"
>
	<slot />
</div>

<style>
	/* TODO: REWRITE WITH SCSS */
	.split {
		display: flex;
		flex-direction: row;
		height: 100%;
		width: 100%;
		max-width: 100vw;
		min-width: calc(100vw - var(--sidebar-width));
	}
	.split.vertical {
		display: block;
		flex-direction: unset;
	}

	:global(.gutter) {
		background-color: transparent;
		border-radius: 3px;
		background-repeat: no-repeat;
		background-position: 50%;
		z-index: 2147483647;
		/* transition: background-color 250ms ease; */
	}
	:global(.gutter:hover) {
		background-color: #4ca5ff;
	}

	:global(.gutter.gutter-horizontal) {
		cursor: col-resize;
		min-width: 10px;
	}

	:global(.gutter.gutter-vertical) {
		cursor: row-resize;
		min-height: 10px;
	}
</style>
