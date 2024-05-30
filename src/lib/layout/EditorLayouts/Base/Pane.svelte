<script>
	//@ts-nocheck
	import {
		isVertical,
		editorContainerHeight,
		editorOutContainerHeight,
		editorOutContainerWidth
	} from '$lib/stores/layoutStore';
	import { hover } from '$lib/actions/hover';
	import { fade } from 'svelte/transition';
	import {
		splitInstanceStore,
		editorSplit,
		clearSplit,
		paneManager,
		protectPaneManager,
		inputOutputContainerWidth,
		inputOutputContainerHeight
	} from '$lib/stores/splitStore';
	import {
		focusedFileId,
		focusedFolderId,
		codePanes2,
		previouslyFocusedFileId,
		autoCompile,
		triggerCompile,
		fileSystemSidebarWidth
	} from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { afterUpdate, onDestroy, tick } from 'svelte';

	/**
	 * @type {string | string[]}
	 */
	export let id;
	/**
	 * @type {any}
	 */
	export let label;

	/**
	 * @type {HTMLElement}
	 */
	let split;
	/**
	 * @type {number}
	 */
	let splitClientWidth = 0;
	/**
	 * @type {number}
	 */
	let splitClientHeight = 0;
	let showPaneOptions = false;
	$: showOptionsObserved = showPaneOptions;
	$: value = $isVertical;
	$: isOutput = $editorOutContainerHeight && $editorOutContainerHeight <= 30;
	$: isEditor = $editorContainerHeight && $editorContainerHeight <= 30;
	$: (() => {
		if (split) {
			let splitModel = split?.querySelector('.slot-control-bar .container');
			// Edge case 1: the editor is full and the output is closed
			if (isOutput && !isEditor) {
				split.style.minWidth = `${30}px !important`;

				if (id?.includes('js') || id?.includes('css') || id?.includes('html')) {
					if (splitClientWidth <= 45) {
						splitModel.style.transform = 'rotate(90deg)';
					} else {
						// console.log('splitClientWidth::', splitClientWidth);
						splitModel.style.transform = 'rotate(0deg)';
					}
				}
				// Edge case 2: the editor is closed and the output is full
			} else if (isEditor && !isOutput) {
				if (id?.includes('js') || id?.includes('css') || id?.includes('html')) {
					split.style.minWidth = `${80}px`;
					splitModel.style.transform = 'rotate(0deg)';
				}
				// Edge case 3: the editor and the output are both open
			} else if (!isEditor && !isOutput) {
				split.style.minWidth = `${30}px`;
				if (splitClientWidth <= 45) {
					if (!isEditor && !isOutput) {
						splitModel.style.transform = 'rotate(90deg)';
					}
				} else {
					if (!isEditor && !isOutput) {
						splitModel.style.transform = 'rotate(0deg)';
					}
				}
			}
		}
	})();
	$: codePanesLength = $codePanes2?.length;
	$: idSplit = id?.split('-');
	$: fileId = idSplit[idSplit?.length - 1];
	$: isFocused =
		$focusedFileId?.toString() === fileId || ($codePanes2?.length < 2 && id !== 'split-output');
	$: focusedPane = $codePanes2?.find((pane) => pane.fileId === $focusedFileId);
	$: focusedLabel =
		focusedPane?.fileName && focusedPane?.type && $codePanes2?.length < 2
			? `${focusedPane?.fileName}.${focusedPane?.type}`
			: '';

	const maximize = async (
		/** @type {MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ currentChild,
		isVertical = false
	) => {
		const { target } = currentChild;
		const selection = target.closest('section');

		// get the target index
		const targetIndex = $codePanes2?.findIndex((pane) => {
			return pane.paneID?.includes(selection?.id);
		});

		if (codePanesLength === 1) {
			$editorSplit.setSizes([100]);
		} else if (codePanesLength === 2) {
			if (targetIndex === 0) {
				$editorSplit.setSizes([97, 3]);
			} else if (targetIndex === 1) {
				$editorSplit.setSizes([3, 97]);
			}
		} else if (codePanesLength === 3) {
			if (targetIndex === 0) {
				$editorSplit.setSizes([93.12459240436259, 3.437263361299153, 3.4381442343382815]);
			} else if (targetIndex === 1) {
				$editorSplit.setSizes([3.437263361299153, 93.12459240436259, 3.4381442343382815]);
			} else if (targetIndex === 2) {
				$editorSplit.setSizes([3.437263361299153, 3.4381442343382815, 93.12459240436259]);
			}
		}
	};

	const setFocused = () => {
		if ($focusedFileId?.toString() === fileId) {
			return;
		}
		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(fileId);
		focusedFolderId.set(null);
		if ($autoCompile) {
			$clearSplit = true;
		}
	};

	afterUpdate(() => {
		const idInPaneManager = $paneManager.some((pane) => {
			return pane.id === id;
		});
		const ioInPaneManager = $paneManager.some((pane) => {
			return pane.id === 'split-input-output';
		});
		const isSideBarInPaneManager = $paneManager.some((pane) => {
			return pane.id === 'split-file-explorer';
		});
		const isSplit3InPaneManager = $paneManager.some((pane) => {
			return pane.id === 'split-3';
		});

		if (!isSplit3InPaneManager && $protectPaneManager === false) {
			$paneManager = [
				...$paneManager,
				{
					id: 'split-3',
					split: split,
					splitClientWidth: $editorOutContainerWidth,
					splitClientHeight: $editorOutContainerHeight
				}
			];
		}

		if (!ioInPaneManager && $protectPaneManager === false) {
			$paneManager = [
				...$paneManager,
				{
					id: 'split-input-output',
					split: split,
					splitClientWidth: $inputOutputContainerWidth,
					splitClientHeight: $inputOutputContainerHeight
				}
			];
		}

		if (!isSideBarInPaneManager && $protectPaneManager === false) {
			$paneManager = [
				...$paneManager,
				{ id: 'split-file-explorer', split: split, splitClientWidth: $fileSystemSidebarWidth }
			];
		}
		if (!idInPaneManager && $protectPaneManager === false) {
			$paneManager = [
				...$paneManager,
				{ id: id, split: split, splitClientWidth, splitClientHeight }
			];
		} else if (
			$protectPaneManager === false &&
			(idInPaneManager || isSideBarInPaneManager || ioInPaneManager)
		) {
			$paneManager = $paneManager.map((pane) => {
				if (
					pane.id === id &&
					$triggerCompile === false &&
					$clearSplit === false &&
					$protectPaneManager === false
				) {
					pane.split = split;
					pane.splitClientWidth = splitClientWidth;
					pane.splitClientHeight = splitClientHeight;
				} else if (pane.id === 'split-file-explorer') {
					pane.split = split;
					pane.splitClientWidth = $fileSystemSidebarWidth;
				} else if (pane.id === 'split-input-output') {
					pane.split = split;
					pane.splitClientWidth = $inputOutputContainerWidth;
					pane.splitClientHeight = $inputOutputContainerHeight;
				}

				return pane;
			});
		}
	});

	onDestroy(() => {
		const idInPaneManager = $paneManager.some((pane) => {
			return pane.id === id;
		});

		// if the pane id that is being destroyed is in the paneManager
		// then remove it from the paneManager
		if (idInPaneManager) {
			$paneManager = $paneManager.filter((pane) => pane.id !== id);
		}
	});

	// pull in the theme and join it into a string
	$: themeString = $themeDataStore?.theme?.join(' ');
</script>

<!-- Add the theme string to sections style -->
<section
	{id}
	class:isFocused
	class="section-panel"
	style="overflow-x: visible; {themeString}"
	bind:this={split}
	bind:clientWidth={splitClientWidth}
	bind:clientHeight={splitClientHeight}
	on:click={() => setFocused()}
>
	<div
		class="slot-control-bar"
		role="button"
		tabindex="0"
		on:keyup={(e) => {
			// console.log(e.key);
		}}
		on:dblclick={(e) => {
			maximize(e, !value);
		}}
	>
		<div
			class="container no-selection"
			role="button"
			tabindex="0"
			use:hover
			on:hovered={() => (showPaneOptions = !(splitClientWidth <= 30) ? true : false)}
			on:mouseleave={() => (showPaneOptions = false)}
		>
			{#if label}
				<span class="label noSelect">
					{label}
				</span>
			{/if}
			{#if focusedFileId && $codePanes2?.length > 1}
				{focusedLabel}
			{/if}
			<!-- {#if showOptionsObserved}
				<div
					class="pane-options"
					in:fade|local={{ delay: 50, duration: 100 }}
					out:fade|local={{ delay: 0, duration: 200 }}
				>
					option
				</div>
			{/if} -->
		</div>
	</div>
	<slot name="pane-content" />
</section>

<style>
	.slot-control-bar {
		position: relative;
	}
	.slot-control-bar:hover {
		cursor: pointer;
	}
	.container {
		border-radius: 8px 8px 0px 0px;
		padding: 0 10px 0 10px;
		z-index: 1;
		width: calc(100% - 20px);
		height: 30px;
		position: absolute;
		display: flex;
		align-items: center;
		color: var(--color-primary);
		/* transition: background-color 300ms cubic-bezier(0.215, 0.610, 0.355, 1); */
	}
	.section-panel {
		border-radius: 6px;
		border: 2px solid #5c5c5c;
		min-width: 30px;
	}
	:global(.split.vertical) {
		display: flex !important;
		flex-direction: column !important;
	}
	section.isFocused {
		border: 2px solid #4ca5ff;
	}
	span.label {
		font-family: var(--header-font), 'sans-serif';
		font-size: 14px;
		font-weight: 200;
	}
	span.label.noSelect {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}
</style>
