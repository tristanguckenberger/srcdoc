<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onDestroy, onMount, tick, untrack } from 'svelte';
	import {
		clearSplit,
		splitInstanceStore,
		editorSplit,
		protectPaneManager,
		resetPanes,
		cleanGutters
	} from '$lib/stores/splitStore';
	import Split from 'split.js';
	import { didRotation, paneMinHeightModifier, isDragging } from '$lib/stores/layoutStore';
	import {
		fileSystemSidebarOpen,
		guiEditorSidebarOpen,
		guiEditorSidebarWidth,
		fileSystemSidebarWidth,
		openInNewPane,
		autoCompile,
		triggerCompile,
		codePanes2,
		openFiles
	} from '$lib/stores/filesStore';
	import {
		editorSplitStore,
		splitStore,
		paneManager,
		inputOutputContainerWidth,
		inputOutputContainerHeight,
		outputsContainerHeight,
		outputsContainerWidth,
		isAddingPane
	} from '$lib/stores/splitStore';
	import { debounce } from 'lodash-es';

	let {
		panes = [],
		sizes,
		vertical = false,
		splitParent,
		editor,
		output,
		sidebar,
		previousRoute,
		content,
		children
	} = $props();

	/**
	 * @type {Split.Instance}
	 */
	let splitInstance = $state(null);
	let waiting = $state(false);
	let split = $state(null);
	let firstRun = $state(true);
	let paneIDs = $derived(panes?.map((pane) => (typeof pane === 'string' ? pane : pane?.paneID)));
	let isSideBarOpen = $derived($fileSystemSidebarOpen ?? $guiEditorSidebarOpen);
	let editorSplitCheck = $derived(
		paneIDs?.includes('#split-file-explorer') && paneIDs?.includes('#split-input-output')
	);
	let primarySplitCheck = $derived(paneIDs?.includes('#split-2') && paneIDs?.includes('#split-3'));
	let splitPath = $derived($page?.route?.id?.split('/') ?? []);
	let isCodeEngine = $derived(splitPath.some((path) => path === 'engine'));
	let isGuiEngine = $derived(splitPath.some((path) => path === 'gui-engine'));
	let parentClassList = $derived(splitInstance?.parent?.classList);
	let isEditorSplit = $derived(parentClassList?.contains('split-2'));
	let dragging = $state(false);
	let fullSize = $state(true);

	const debouncedDrag = debounce(async (e) => {
		// await tick();
		console.log('dragging::e::', e);
		// await tick();
		isDragging.set(true);
		// dragging = true;
		// await tick();
	}, 100);

	const debouncedDragStart = debounce(async (e) => {
		// await tick();
		console.log('drag start::e::', e);
		isDragging.set(true);
		// dragging = true;
		// await tick();
	}, 200);

	const debouncedDragEnd = debounce(async (e) => {
		// await tick();
		console.log('drag end::e::', e);
		isDragging.set(false);
		// dragging = false;
		// await tick();
	}, 200);

	const cleanUpGutters = async (vertical) => {
		await tick();
		const paneCount = paneIDs?.length;
		const splitContainer = document.querySelector('.split-2');
		const gutters = splitContainer?.querySelectorAll('.gutter');
		const verticalSplitGutters = splitContainer?.querySelectorAll('.gutter.gutter-vertical');
		const horizontalSplitGutters = splitContainer?.querySelectorAll('.gutter.gutter-horizontal');

		if (!splitContainer) {
			console.warn('Split container not found for split-2.');
			return;
		}

		if (gutters?.length > paneCount - 1) {
			if (vertical) {
				const extraGutters = gutters.length - (paneCount - 1);
				const guttersToDel = Array.from(verticalSplitGutters).slice(-extraGutters);
				guttersToDel.forEach((gutter) => gutter.remove());
			} else {
				const extraGutters = gutters.length - (paneCount - 1);
				const guttersToDel = Array.from(horizontalSplitGutters).slice(-extraGutters);
				guttersToDel.forEach((gutter) => gutter.remove());
			}
		}

		await tick();

		if (gutters?.length < paneCount - 1) {
			const missingGutters = paneCount - 1 - gutters.length;
			console.log(`Adding ${missingGutters} missing gutter(s).`);

			for (let i = 0; i < missingGutters; i++) {
				const gutter = document.createElement('div');
				gutter.className = vertical ? 'gutter gutter-vertical' : 'gutter gutter-horizontal';
				if (vertical) {
					gutter.style.height = '10px';
				} else {
					gutter.style.width = '10px';
				}

				const panes = splitContainer.querySelectorAll('.pane');
				if (panes[i]) {
					panes[i].parentNode.insertBefore(gutter, panes[i].nextSibling);
				}
			}
		}

		await tick();
	};

	let sizeUpdate = $derived.by(() => {
		if (firstRun) {
			return sizes;
		}

		if (primarySplitCheck) {
			const outputPane = $paneManager?.find((pane) => pane.id === 'split-output');

			return [
				(($inputOutputContainerHeight ?? $outputsContainerHeight) /
					(outputPane?.splitClientHeight +
						($inputOutputContainerHeight ?? $outputsContainerHeight))) *
					100,
				(outputPane?.splitClientHeight /
					(outputPane?.splitClientHeight +
						($inputOutputContainerHeight ?? $outputsContainerHeight))) *
					100
			];
		} else if (editorSplitCheck) {
			return [
				(($fileSystemSidebarWidth ?? $guiEditorSidebarWidth) /
					(($fileSystemSidebarWidth ?? $guiEditorSidebarWidth) + $inputOutputContainerWidth)) *
					100,
				(($inputOutputContainerWidth ?? $outputsContainerWidth) /
					(($fileSystemSidebarWidth ?? $guiEditorSidebarWidth) +
						($inputOutputContainerWidth ?? $outputsContainerWidth))) *
					100
			];
		} else {
			const outputPane = $paneManager?.find((pane) => pane.id === 'split-output');

			if (paneIDs?.length >= 2) {
				const filterSizes = $paneManager?.filter((pane) => paneIDs?.includes(`#${pane?.id}`));

				return filterSizes?.map((pane) => {
					return vertical ? pane?.splitClientHeight : pane?.splitClientWidth;
				});
			} else if (paneIDs?.length === 1) {
				const pane = $paneManager?.find((pane) => paneIDs?.includes(`#${pane?.id}`));

				if (pane?.id === 'split-3') {
					return [100];
				}

				return vertical
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
						];
			} else {
				return [100];
			}
		}
	});

	const reloadEditorSplit = async () => {
		await tick();
		if (!isEditorSplit) return;
		if (!paneIDs || paneIDs.length === 0) return;

		try {
			if (splitInstance && isEditorSplit) {
				if ($openFiles?.length === 0) {
					splitInstance.destroy(false, false);
				} else if ($openFiles?.length >= 2) {
					if ($isAddingPane) {
						cleanUpGutters(!vertical);
						splitInstance.destroy(false, false);
					} else {
						cleanUpGutters(!vertical);
						splitInstance.destroy(false, false);
					}
				}

				splitInstance = Split(paneIDs, {
					direction: vertical ? 'vertical' : 'horizontal',
					gutterSize: 10,
					sizes: sizeUpdate ?? sizes,
					minSize: $paneMinHeightModifier
				});

				if (isEditorSplit) {
					editorSplitStore.set({
						...splitInstance,
						reinit: reloadEditorSplit,
						cleanGutters: cleanUpGutters
					});
				}

				await tick();
			}
		} catch (error) {
			console.log('error::', error);
		}
	};

	const reloadSplit = async () => {
		await tick();
		if (isEditorSplit) return;
		if (!paneIDs || paneIDs.length === 0) return;

		try {
			$protectPaneManager = true;
			if (splitInstance) splitInstance?.destroy(false, false);
			if (!paneIDs || paneIDs?.length === 0) return;
			await tick();

			if (isGuiEngine) {
				await tick();
				splitInstance = Split(paneIDs, {
					direction: vertical ? 'vertical' : 'horizontal',
					gutterSize: 10,
					sizes: sizeUpdate ?? sizes,
					minSize: $paneMinHeightModifier,
					onDrag: splitParent === 'split-input-output' ? debouncedDrag : () => {},
					onDragStart: splitParent === 'split-input-output' ? debouncedDragStart : () => {},
					onDragEnd: splitParent === 'split-input-output' ? debouncedDragEnd : () => {}
					// elementStyle: (dimension, elementSize, gutterSize, index) => {
					// 	console.log('ES::dimension::', dimension);
					// 	console.log('ES::elementSize::', elementSize);
					// 	console.log('ES::gutterSize::', gutterSize);
					// 	console.log('ES::index::', index);
					// 	console.log('ES::splitParent::', splitParent);
					// 	console.log('==================================');
					// 	return {
					// 		width: 'calc(100% - 0px)'
					// 	};
					// }
				});
			} else {
				await tick();
				splitInstance = Split(paneIDs, {
					direction: vertical ? 'vertical' : 'horizontal',
					gutterSize: 10,
					sizes: sizeUpdate ?? sizes,
					minSize: $paneMinHeightModifier,
					onDrag: splitParent === 'split-input-output' ? debouncedDrag : () => {},
					onDragStart: splitParent === 'split-input-output' ? debouncedDragStart : () => {},
					onDragEnd: splitParent === 'split-input-output' ? debouncedDragEnd : () => {}
				});
			}

			splitInstance.setSizes(sizes);
			splitStore.set(splitInstance);
			await tick();
			$protectPaneManager = false;
			$resetPanes = false;
			await tick();
		} catch (error) {
			console.log('error::', error);
		}
	};

	onMount(() => {
		reloadSplit();
		// $resetPanes = true;
	});

	onDestroy(() => {
		split = null;
		sizes = null;
		panes = null;
		splitInstance?.destroy();
		clearSplit.set(true);
	});

	$effect(async () => {
		waiting = true;
		if (isGuiEngine) {
			if ($resetPanes) {
				untrack(() => {
					reloadSplit();
					$resetPanes = false;
				});
			}
		}
		if (isCodeEngine) {
			if ($resetPanes) {
				await tick();
				if (!paneIDs || paneIDs?.length === 0) return;
				$protectPaneManager = true;
				reloadEditorSplit();
				$resetPanes = false;
				await tick();
				if ($splitStore && !isEditorSplit) {
					splitInstance?.destroy(false, false);
					await tick();

					splitInstance = Split(paneIDs, {
						direction: vertical ? 'vertical' : 'horizontal',
						gutterSize: 10,
						sizes: sizeUpdate ?? sizes,
						minSize: 50,
						onDragStart: splitParent === 'split-input-output' ? debouncedDragStart : () => {},
						onDragEnd: splitParent === 'split-input-output' ? debouncedDragEnd : () => {}
					});
					splitInstance.setSizes(sizes);
					splitStore.set(splitInstance);
				}

				splitInstance?.setSizes(sizes);
				await tick();
				$protectPaneManager = false;
			}
		}
		waiting = false;
	});

	$effect(() => {
		try {
			if (!waiting) {
				setTimeout(async () => {
					if (isEditorSplit && splitParent === 'split-2') {
						if ($isAddingPane && didRotation) {
							await tick();
							splitInstance?.destroy(false, false);
						} else if (!$isAddingPane && didRotation) {
							await tick();
							splitInstance?.destroy(false, true);
						} else {
							splitInstance?.destroy(false, true);
						}

						await tick();
						splitInstance = Split(paneIDs, {
							direction: vertical ? 'vertical' : 'horizontal',
							gutterSize: 10,
							sizes: sizeUpdate ?? sizes,
							minSize: $paneMinHeightModifier,
							onDragStart: debouncedDragStart,
							onDragEnd: debouncedDragEnd
						});

						splitInstance?.setSizes(sizes);

						editorSplitStore?.set({
							...splitInstance,
							reinit: reloadEditorSplit,
							cleanGutters: cleanUpGutters
						});
						// if (!waiting && isEditorSplit && splitInstance && splitParent === 'split-2') {
						// 	await splitInstance?.onDrag();

						// 	await splitInstance?.onDragEnd();
						// }
						$isAddingPane = true;
						splitInstance?.setSizes(sizes);
					} else {
						fullSize = $openFiles.length === 0;
					}
				}, 500);
			}
		} catch (error) {
			console.log(error);
		}
	});

	// $effect(() => {
	// });

	// $inspect('Is dragging?::', dragging);
</script>

<div
	class="split {vertical ? 'vertical' : ''} {splitParent} {fullSize ? 'fullSize' : ''}"
	bind:this={split}
	style="--sidebar-width: {isSideBarOpen
		? ($fileSystemSidebarWidth ?? $guiEditorSidebarWidth) + 32
		: 38}px;"
>
	{@render sidebar?.()}
	{@render content?.()}
	{@render children?.()}
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

	/* Override splitjs element styles when no open files */
	.split.fullSize :global(#split-3) {
		width: 100% !important;
	}
</style>
