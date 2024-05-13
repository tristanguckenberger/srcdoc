<script>
	// THIS IS THE INPUT COMPONENT FOR THE EDITOR LAYOUT
	//@ts-nocheck
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Editor from '$lib/ui/Editor/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import { isVertical, editorContainerHeight, editorContainerWidth } from '$lib/stores/layoutStore';
	import { codePanes2, openFiles, focusedFileId } from '$lib/stores/filesStore';

	function getFocusedFile(paneArr) {
		return paneArr?.find((file) => {
			return file?.paneID === `#split-${file.fileName}-${file.type}-${$focusedFileId}`;
		});
	}

	$: $codePanes2,
		(() => {
			const focusedFile = getFocusedFile($codePanes2);
			if (!focusedFile && $focusedFileId !== null) {
				const fileIsOpen = $openFiles?.find((file) => file?.fileId === $focusedFileId);

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
			}
		})();

	const makePaneLabel = (pane) => {
		return pane?.label && pane?.type ? `${pane?.label}.${pane?.type}` : '';
	};
</script>

<section
	id="split-2"
	bind:clientWidth={$editorContainerWidth}
	bind:clientHeight={$editorContainerHeight}
>
	<SplitPane panes={$codePanes2} vertical={!$isVertical} splitParent={'split-input-output'}>
		{#each $codePanes2 as pane}
			<Pane
				id={pane.paneID.split('#')[1]}
				label={$codePanes2?.length > 1 ? `${pane?.label}.${pane?.type}` : makePaneLabel(pane)}
			>
				<Editor slot="pane-content" code={pane.source} type={pane.type} id={pane.paneID} />
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
