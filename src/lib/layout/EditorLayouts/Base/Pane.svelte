<script>
	//@ts-nocheck
	import {
		isVertical,
		editorContainerHeight,
		editorOutContainerHeight,
		editorOutContainerWidth,
		sideBarState
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
		inputOutputContainerHeight,
		outputsContainerWidth,
		outputsContainerHeight,
		resetPanes,
		editorSplitStore
	} from '$lib/stores/splitStore';
	import {
		focusedFileId,
		focusedFolderId,
		codePanes2,
		previouslyFocusedFileId,
		autoCompile,
		triggerCompile,
		fileSystemSidebarWidth,
		guiEditorSidebarOpen,
		guiEditorSidebarWidth,
		docsOpen,
		fileSystemSidebarOpen
	} from '$lib/stores/filesStore';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { onDestroy, tick, onMount, untrack } from 'svelte';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';

	let { id = '', label, paneInfo, paneContent, srcbuild, children } = $props();
	let split = $state();
	let splitClientWidth = $state(0);
	let splitClientHeight = $state(0);
	let showPaneOptions = $state(false);
	let showOptionsObserved = $derived(showPaneOptions);
	let value = $derived($isVertical);
	let isOutput = $derived($editorOutContainerHeight && $editorOutContainerHeight <= 30);
	let isEditor = $derived($editorContainerHeight && $editorContainerHeight <= 30);
	let splitPath = $derived($page?.route?.id?.split('/') ?? []);
	let engineInRoute = $derived(splitPath.some((path) => path === 'engine'));
	let isGuiEngine = $derived(splitPath.some((path) => path === 'gui-engine'));

	function editorHotFix() {
		let splitModel = split?.querySelector('.slot-control-bar .container');
		// the editor is full and the output is closed
		if (isOutput && !isEditor) {
			split.style.minWidth = `${30}px !important`;

			if (id?.includes('js') || id?.includes('css') || id?.includes('html')) {
				if (splitClientWidth <= 45) {
					splitModel.style.transform = 'rotate(90deg)';
				} else {
					splitModel.style.transform = 'rotate(0deg)';
				}
			}
			// the editor is closed and the output is full
		} else if (isEditor && !isOutput) {
			if (id?.includes('js') || id?.includes('css') || id?.includes('html')) {
				split.style.minWidth = `${80}px`;
				splitModel.style.transform = 'rotate(0deg)';
			}
			// the editor and the output are both open
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

	$effect(() => {
		if (split) {
			// untrack(() => {
			editorHotFix();
			// });
		}
	});
	let codePanesLength = $derived($codePanes2?.length);
	let idSplit = $derived.by(() => {
		if (id?.includes('explorer') || id?.includes('output')) return [];
		return id?.split('-');
	});
	let fileId = $derived.by(() => {
		if (idSplit?.length === 0) return;
		let foundId = idSplit[idSplit?.length - 1];

		return foundId;
	});
	let isFocused = $derived(
		((fileId && $focusedFileId?.toString() === fileId) ||
			($codePanes2?.length < 2 && id !== 'split-output' && id !== 'split-file-explorer')) &&
			!isGuiEngine
	);
	let focusedPane = $derived($codePanes2?.find((pane) => pane.fileId === $focusedFileId));
	let focusedLabel = $derived(
		focusedPane?.fileName && focusedPane?.type && $codePanes2?.length < 2
			? `${focusedPane?.fileName}.${focusedPane?.type}`
			: ''
	);

	const maximize = async (
		/** @type {MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ currentChild,
		isVertical = false
	) => {
		const { target } = currentChild;
		const selection = target.closest('section');
		const targetIndex = $codePanes2?.findIndex((pane) => {
			return pane.paneID?.includes(selection?.id);
		});

		if (codePanesLength === 1) {
			$editorSplitStore?.setSizes([100]);
		} else if (codePanesLength === 2) {
			if (targetIndex === 0) {
				$editorSplitStore?.setSizes([97, 3]);
			} else if (targetIndex === 1) {
				$editorSplitStore?.setSizes([3, 97]);
			}
		} else if (codePanesLength === 3) {
			if (targetIndex === 0) {
				$editorSplitStore?.setSizes([93.12459240436259, 3.437263361299153, 3.4381442343382815]);
			} else if (targetIndex === 1) {
				$editorSplitStore?.setSizes([3.437263361299153, 93.12459240436259, 3.4381442343382815]);
			} else if (targetIndex === 2) {
				$editorSplitStore?.setSizes([3.437263361299153, 3.4381442343382815, 93.12459240436259]);
			}
		}
	};

	const setFocused = () => {
		if (
			id === 'split-output' ||
			id === 'split-file-explorer' ||
			!fileId ||
			$focusedFileId?.toString() === fileId
		)
			return;
		// if ($focusedFileId?.toString() === fileId) {
		// 	return;
		// }
		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(fileId);
		focusedFolderId.set(null);
		if ($autoCompile) {
			$clearSplit = true;
		}
	};

	let idInPaneManager = $derived.by(() =>
		$paneManager?.some((pane) => {
			return pane.id === id;
		})
	);
	let ioInPaneManager = $derived.by(() =>
		$paneManager?.some((pane) => {
			return pane.id === 'split-input-output';
		})
	);
	let isSideBarInPaneManager = $derived.by(() =>
		$paneManager?.some((pane) => {
			return pane.id === 'split-file-explorer';
		})
	);
	let isSplit3InPaneManager = $derived.by(() =>
		$paneManager?.some((pane) => {
			return pane.id === 'split-3';
		})
	);

	let paneManagerDerived = $derived.by(() => {
		if (!isSplit3InPaneManager && $protectPaneManager === false) {
			return [
				...$paneManager,
				{
					id: 'split-3',
					split: split,
					splitClientWidth: $editorOutContainerWidth,
					splitClientHeight: $editorOutContainerHeight
				}
			];
		} else if (!ioInPaneManager && $protectPaneManager === false) {
			return [
				...$paneManager,
				{
					id: 'split-input-output',
					split: split,
					splitClientWidth: $inputOutputContainerWidth,
					splitClientHeight: $inputOutputContainerHeight
				}
			];
		} else if (!isSideBarInPaneManager && $protectPaneManager === false) {
			return [
				...$paneManager,
				{
					id: 'split-file-explorer',
					split: split,
					splitClientWidth: $fileSystemSidebarWidth ?? $guiEditorSidebarWidth
				}
			];
		} else if (!idInPaneManager && $protectPaneManager === false) {
			return [...$paneManager, { id: id, split: split, splitClientWidth, splitClientHeight }];
		} else if (
			$protectPaneManager === false &&
			(idInPaneManager || isSideBarInPaneManager || ioInPaneManager)
		) {
			return $paneManager?.map((pane) => {
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
					pane.splitClientWidth = $fileSystemSidebarWidth ?? $guiEditorSidebarWidth;
				} else if (pane.id === 'split-input-output') {
					pane.split = split;
					pane.splitClientWidth = $inputOutputContainerWidth ?? $outputsContainerWidth;
					pane.splitClientHeight = $inputOutputContainerHeight ?? $outputsContainerHeight;
				}

				return pane;
			});
		}
	});

	onDestroy(() => {
		const idInPaneManager = $paneManager?.some((pane) => {
			return pane.id === id;
		});

		// if the pane id that is being destroyed is in the paneManager
		// then remove it from the paneManager
		if (idInPaneManager) {
			$paneManager = $paneManager?.filter((pane) => pane.id !== id);
		}

		$protectPaneManager = false;
	});

	// pull in the theme and join it into a string
	let themeString = $derived($themeDataStore?.theme?.join(' '));
	let isSideBarOpen = $derived($sideBarState);
	let isGuiEditorSidebarOpen = $derived($guiEditorSidebarOpen);
</script>

<!-- Add the theme string to sections style -->
<section
	{id}
	class="section-panel {isFocused ? 'isFocused' : ''} {id === 'split-input-output'
		? 'codeEditor'
		: ''} {engineInRoute ? 'engineInRoute' : ''} {!$fileSystemSidebarOpen &&
	id === 'split-file-explorer'
		? 'hidden'
		: ''}"
	style="overflow-x: visible; {themeString} --sidebar-width: {isSideBarOpen ? 240 : 0}px;"
	bind:this={split}
	bind:clientWidth={splitClientWidth}
	bind:clientHeight={splitClientHeight}
	onclick={() => setFocused()}
	onkeypress={() => {}}
	role="tabpanel"
	tabindex="0"
>
	<div
		class="slot-control-bar"
		role="button"
		tabindex="0"
		onkeyup={(e) => {}}
		ondblclick={(e) => {
			// TODO: changing $isVertical might break this
			maximize(e, !value);
		}}
	>
		<div
			class="container no-selection"
			role="button"
			tabindex="0"
			use:hover
			onhovered={() => (showPaneOptions = !(splitClientWidth <= 30) ? true : false)}
			onmouseleave={() => (showPaneOptions = false)}
		>
			{#if label}
				<span class="label noSelect">
					{label}
				</span>
			{/if}
			{#if focusedFileId && $codePanes2?.length > 1}
				{focusedLabel}
			{/if}
		</div>
	</div>
	{@render paneContent?.()}
	{@render children?.()}
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
	}
	.section-panel {
		border-radius: 6px;
		border: 2px solid #5c5c5c;
		min-width: 30px;
		overflow: hidden;
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
	section.section-panel.codeEditor.engineInRoute {
		border-radius: unset;
		border: unset;
	}

	section.section-panel.hidden {
		display: none;
	}

	:global(#split-outputs) {
		width: 100%;
		height: 100%;
		height: calc(100% - 4px);
		flex: 1;
	}
	:global(#split-outputs) section {
		height: 100% !important;
	}
	@media (min-width: 498px) {
		:global(.engineInRoute #split-side-panel) {
			height: calc(100% + 16px);
			bottom: 40px;
		}
		:global(.engineInRoute.noOpenTabs #split-side-panel) {
			height: calc(100% - 24px);
			bottom: 0px;
		}
	}
	/* Horizontal Split */
	:global(.split) {
		width: 100%;
	}
</style>
