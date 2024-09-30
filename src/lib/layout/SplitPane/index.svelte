<svelte:options accessors />

<script>
	// @ts-nocheck
	import { afterUpdate, onDestroy, tick } from 'svelte';
	import {
		clearSplit,
		splitInstanceStore,
		editorSplit,
		protectPaneManager,
		resetPanes
	} from '$lib/stores/splitStore';
	import Split from 'split.js';
	import { paneMinHeightModifier } from '$lib/stores/layoutStore';
	import {
		fileSystemSidebarOpen,
		fileSystemSidebarWidth,
		openInNewPane,
		autoCompile,
		triggerCompile,
		codePanes2
	} from '$lib/stores/filesStore';
	import {
		splitStore,
		paneManager,
		inputOutputContainerWidth,
		inputOutputContainerHeight
	} from '$lib/stores/splitStore';

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
	 * @type {string}
	 */
	export let splitParent;

	/**
	 * @type {Split.Instance}
	 */
	let splitInstance;

	$: paneIDs = panes?.map((pane) => (typeof pane === 'string' ? pane : pane?.paneID));

	let sizeUpdate;
	$: $protectPaneManager === false,
		(() => {
			if (firstRun) {
				return (sizeUpdate = sizes);
			}

			const editorSplit =
				paneIDs?.includes('#split-file-explorer') && paneIDs?.includes('#split-input-output');
			const primarySplit = paneIDs?.includes('#split-2') && paneIDs?.includes('#split-3');

			if (primarySplit) {
				const outputPane = $paneManager?.find((pane) => pane.id === 'split-output');

				return (sizeUpdate = [
					($inputOutputContainerHeight /
						(outputPane?.splitClientHeight + $inputOutputContainerHeight)) *
						100,
					(outputPane.splitClientHeight /
						(outputPane.splitClientHeight + $inputOutputContainerHeight)) *
						100
				]);
			} else if (editorSplit) {
				return (sizeUpdate = [
					($fileSystemSidebarWidth / ($fileSystemSidebarWidth + $inputOutputContainerWidth)) * 100,
					($inputOutputContainerWidth / ($fileSystemSidebarWidth + $inputOutputContainerWidth)) *
						100
				]);
			} else {
				const outputPane = $paneManager?.find((pane) => pane.id === 'split-output');

				if (paneIDs?.length >= 2) {
					const filterSizes = $paneManager?.filter((pane) => paneIDs?.includes(`#${pane?.id}`));

					return (sizeUpdate = filterSizes?.map((pane) => {
						return vertical ? pane?.splitClientHeight : pane?.splitClientWidth;
					}));
				} else if (paneIDs?.length === 1) {
					const pane = $paneManager?.find((pane) => paneIDs?.includes(`#${pane?.id}`));

					if (pane?.id === 'split-3') {
						return (sizeUpdate = [100]);
					}

					return (sizeUpdate = vertical
						? [
								(pane?.splitClientHeight /
									(pane?.splitClientHeight + outputPane?.splitClientHeight)) *
									100,
								(outputPane?.splitClientHeight /
									(pane?.splitClientHeight + outputPane?.splitClientHeight)) *
									100
						  ]
						: [
								(pane?.splitClientWidth / (pane?.splitClientWidth + outputPane?.splitClientWidth)) *
									100,
								(outputPane?.splitClientWidth /
									(pane?.splitClientWidth + outputPane?.splitClientWidth)) *
									100
						  ]);
				} else {
					return (sizeUpdate = [100]);
				}
			}
		})();

	const reloadSplit = () => {
		try {
			$protectPaneManager = true;
			// Destory existing splitInstance
			if (splitInstance) splitInstance?.destroy(true, false);

			if (!paneIDs || paneIDs?.length === 0) return;

			// Init a new split instance
			splitInstance = Split(paneIDs, {
				direction: vertical ? 'vertical' : 'horizontal',
				gutterSize: 10,
				// @ts-ignore
				sizes: sizeUpdate ?? sizes,
				minSize: $paneMinHeightModifier
			});

			splitStore.set(splitInstance);
			$protectPaneManager = false;
		} catch (error) {
			console.log('error::', error);
		}
	};

	/**
	 * @type {HTMLDivElement | null}
	 */
	let split;
	let firstRun = true;

	$: $fileSystemSidebarOpen,
		(() => {
			if ($autoCompile) {
				clearSplit.set(true);
			}
		})();

	afterUpdate(() => {
		if ($clearSplit) {
			reloadSplit();
			setTimeout(() => {
				clearSplit?.set(false);
				openInNewPane.set(false);
				triggerCompile.set(false);
				firstRun = false;
			}, 100);
		}
	});

	onDestroy(() => {
		split = null;
		paneIDs = null;
		sizes = null;
		panes = null;
		splitInstance?.destroy();
		clearSplit.set(true);
	});

	// Replaces functionality found in onMount
	$: if (split && $triggerCompile) {
		panes?.forEach(async (query) => {
			const queryString = typeof query === 'string' ? query : query?.paneID;
			const splitDom = await split?.querySelector(queryString);
			splitDom?.classList?.add('pane');
		});

		// Init Split.js
		setTimeout(() => reloadSplit(), 50);
	}

	$: if (
		splitInstance &&
		splitParent === 'split-input-output' &&
		splitInstance?.getSizes()?.length >= 2
	) {
		const sizes = splitInstance?.getSizes();
		if (sizes?.some((size) => size === undefined || size < 30)) {
			const baseSizes = splitInstance?.getSizes()?.map((size) => {
				return (size = splitInstance?.getSizes()?.length > 2 ? 30 : 50);
			});
			splitInstance.setSizes(baseSizes);

			editorSplit.set(splitInstance);
		} else if (sizes?.some((size) => size > 100)) {
			const baseSizes = splitInstance?.getSizes()?.map((size) => {
				return (size = splitInstance?.getSizes()?.length > 2 ? 30 : 50);
			});
			splitInstance.setSizes(baseSizes);
			editorSplit.set(splitInstance);
			// setTimeout(() => {

			// }, 50);
		} else {
			editorSplit.set(splitInstance);
		}
	} else if (splitInstance && splitParent === 'split-input-output') {
		setTimeout(() => {
			splitInstance.setSizes([100]);
			editorSplit.set(splitInstance);
		}, 50);
	}

	$: isSideBarOpen = $fileSystemSidebarOpen;

	$: (async () => {
		if ($resetPanes) {
			if (splitInstance) {
				// Destroy the current instance when switching direction
				splitInstance.destroy(false, false);
			}

			// Reinitialize Split.js with the new direction (vertical or horizontal)
			splitInstance = Split(paneIDs, {
				direction: vertical ? 'vertical' : 'horizontal',
				gutterSize: 10,
				sizes: sizeUpdate ?? sizes,
				minSize: $paneMinHeightModifier
			});
			await tick();
			// Store the updated instance
			// splitStore.set(splitInstance);
			editorSplit.set(splitInstance);

			$resetPanes = false;
		}
	})();
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
		max-width: 100%;
		min-width: calc(100% - var(--sidebar-width));
		max-height: 100%;
		min-height: 100%;
	}
	.split.vertical {
		flex-direction: column;
	}

	:global(.gutter) {
		background-color: transparent;
		border-radius: 2px;
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
