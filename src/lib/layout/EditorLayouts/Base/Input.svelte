<script>
	// THIS IS THE INPUT COMPONENT FOR THE EDITOR LAYOUT
	//@ts-nocheck
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Editor from '$lib/ui/Editor/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import { isVertical, editorContainerHeight, editorContainerWidth } from '$lib/stores/layoutStore';
	import { codePanes2, openFiles, focusedFileId, filesToUpdate } from '$lib/stores/filesStore';
	import { resetPanes } from '$lib/stores/splitStore';
	import { onDestroy, tick } from 'svelte';

	function getFocusedFile(paneArr) {
		return paneArr?.find((file) => {
			return file?.paneID === `#split-${file.fileName}-${file.type}-${$focusedFileId}`;
		});
	}

	$effect.pre(async () => {
		await tick();

		// Temporary variables to calculate changes
		let updatedCodePanes = [...$codePanes2];
		let updatedFocusedFileId = $focusedFileId;

		const focusedFile = getFocusedFile(updatedCodePanes);

		if (!focusedFile && updatedFocusedFileId !== null) {
			const fileIsOpen = $openFiles?.find(
				(file) => file?.id?.toString() === updatedFocusedFileId?.toString()
			);

			if (fileIsOpen) {
				updatedCodePanes.push({
					paneID: `#split-${fileIsOpen?.name}-${fileIsOpen?.type}-${fileIsOpen?.id}`,
					source: fileIsOpen?.source,
					type: fileIsOpen?.type
				});
			}
		} else if (!focusedFile && !updatedFocusedFileId) {
			updatedFocusedFileId = $openFiles?.[0]?.id;
		}

		// Handle mismatches between openFiles and codePanes2
		updatedCodePanes = updatedCodePanes.map((currentPane, index) => {
			const currentFile = $openFiles[index];
			if (currentPane.source !== currentFile.content) {
				return { ...currentPane, source: currentFile.content };
			}
			return currentPane;
		});

		// Check against filesToUpdate
		if ($filesToUpdate?.length > 0) {
			$filesToUpdate.forEach((fileToUpdate) => {
				updatedCodePanes = updatedCodePanes.map((currentPane) => {
					if (currentPane.fileId === fileToUpdate.id) {
						if (currentPane.source !== fileToUpdate.content) {
							return { ...currentPane, source: fileToUpdate.content };
						}
					}
					return currentPane;
				});
			});
		}

		$codePanes2 = updatedCodePanes;
		$focusedFileId = updatedFocusedFileId;

		await tick();
	});

	$effect(async () => {
		await tick();
		$resetPanes = true;
	});

	const makePaneLabel = (pane) => {
		return pane?.label && pane?.type ? `${pane?.label}.${pane?.type}` : '';
	};
	let reactivePanes = $derived($codePanes2);
	let value = $derived($isVertical);
	let calculatedSizes = $derived.by(() => {
		switch (reactivePanes?.length) {
			case 1:
				return [100];
			case 2:
				return [50, 50];
			case 3:
				return [100 / 3, 100 / 3, 100 / 3];
			default:
				return [];
		}
	});
</script>

<div
	id="split-2"
	class={{ vertical: value }}
	bind:clientWidth={$editorContainerWidth}
	bind:clientHeight={$editorContainerHeight}
>
	<SplitPane panes={reactivePanes} vertical={value} splitParent={'split-2'} sizes={calculatedSizes}>
		{#if $openFiles?.length > 0}
			{#each reactivePanes as pane, i (i)}
				<Pane
					id={pane?.paneID?.split('#')[1]}
					label={reactivePanes?.length > 1 ? `${pane?.label}.${pane?.type}` : makePaneLabel(pane)}
					paneInfo={pane}
				>
					<Editor code={pane.source} type={pane.type} id={pane.paneID} readonly={false} />
				</Pane>
			{/each}
		{/if}
	</SplitPane>
</div>

<style>
	#split-2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
