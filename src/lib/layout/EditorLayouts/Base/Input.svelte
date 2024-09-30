<script>
	// THIS IS THE INPUT COMPONENT FOR THE EDITOR LAYOUT
	//@ts-nocheck
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Editor from '$lib/ui/Editor/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import { isVertical, editorContainerHeight, editorContainerWidth } from '$lib/stores/layoutStore';
	import { codePanes2, openFiles, focusedFileId, filesToUpdate } from '$lib/stores/filesStore';
	import { afterUpdate, tick } from 'svelte';

	function getFocusedFile(paneArr) {
		return paneArr?.find((file) => {
			return file?.paneID === `#split-${file.fileName}-${file.type}-${$focusedFileId}`;
		});
	}

	afterUpdate(async () => {
		await tick();
		const focusedFile = getFocusedFile($codePanes2);
		if (!focusedFile && $focusedFileId !== null) {
			const fileIsOpen = $openFiles?.find(
				(file) => file?.id?.toString() === $focusedFileId?.toString()
			);

			if (fileIsOpen) {
				$codePanes2 = [
					...$codePanes2,
					{
						paneID: `#split-${fileIsOpen?.name}-${fileIsOpen?.type}-${fileIsOpen?.id}`,
						source: fileIsOpen?.source,
						type: fileIsOpen?.type
					}
				];
			}
		} else if (!focusedFile && !$focusedFileId) {
			$focusedFileId = $openFiles?.[0]?.id;
		}

		// Handle openFiles and codePanes2 store mismatches
		$codePanes2?.forEach((_, index) => {
			// There should be an equal amount of indicies in
			// codePanes2 and openFiles, so we should be able to use
			// the index from codePanes2 to compare openFiles and
			// codePanes2
			const currentPane = $codePanes2[index];
			const currentFile = $openFiles[index];
			const mismatchFound = currentPane.source !== currentFile.content;

			if (mismatchFound) {
				currentPane.source = currentFile.content;
			}
		});

		// Check against filesToUpdate too
		if ($filesToUpdate?.length > 0) {
			$filesToUpdate?.forEach((_, index) => {
				const currentFileToUpdate = $filesToUpdate[index];
				const currentFileToUpdateId = $filesToUpdate[index].id;

				// Loop over each codePane and check for a mismatch
				$codePanes2?.forEach((_, paneIndex) => {
					const currentPane = $codePanes2[paneIndex];
					const currentFile = $openFiles[paneIndex];
					const idMatchFound = currentPane.fileId === currentFileToUpdateId;

					if (idMatchFound) {
						const mismatchFound =
							currentPane.source !== currentFileToUpdate.content ||
							currentFile.content !== currentFileToUpdate.content;
						if (mismatchFound) {
							currentPane.source = currentFileToUpdate.content;
							// currentFile.content = currentFileToUpdate.content;
						}
					}
				});
			});
		}

		await tick();
	});

	const makePaneLabel = (pane) => {
		return pane?.label && pane?.type ? `${pane?.label}.${pane?.type}` : '';
	};

	$: reactivePanes = $codePanes2;

	$: value = $isVertical;
</script>

<section
	id="split-2"
	bind:clientWidth={$editorContainerWidth}
	bind:clientHeight={$editorContainerHeight}
>
	<SplitPane panes={reactivePanes} vertical={value} splitParent={'split-input-output'}>
		{#each reactivePanes as pane, i (i)}
			<Pane
				id={pane.paneID.split('#')[1]}
				label={reactivePanes?.length > 1 ? `${pane?.label}.${pane?.type}` : makePaneLabel(pane)}
			>
				<Editor
					slot="pane-content"
					code={pane.source}
					type={pane.type}
					id={pane.paneID}
					readonly={false}
				/>
			</Pane>
		{/each}
	</SplitPane>
</section>

<style>
	#split-2 {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
