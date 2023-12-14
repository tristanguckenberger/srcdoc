<script>
	// @ts-nocheck
	import { openFiles } from '$lib/stores/filesStore.js';
	import MonacoEditorScripts from './MonacoEditorScripts.svelte';
	import {
		baseDataStore,
		derivedCodeData,
		codePanes2,
		focusedFileId,
		previouslyFocusedFileId,
		fileStoreFiles,
		filesToUpdate
	} from '$lib/stores/filesStore.js';
	import { onMount } from 'svelte';

	export let id;
	export let code;
	export let type;

	// Add this in the onMount lifecycle hook or another suitable place
	onMount(() => {
		function handleKeyDown(event) {
			// Check for Ctrl or Cmd key
			if (event.ctrlKey || event.metaKey) {
				// Check for 'S' key
				if (event.key === 's' || event.keyCode === 83) {
					// Prevent default save dialog
					event.preventDefault();
					saveFile(focusedFileId); // Assuming 'focusedFileId' is the ID of the currently focused file
				}
			}
		}

		// Attach event listener
		window.addEventListener('keydown', handleKeyDown);

		// Cleanup
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	$: codeType = type;

	$: $derivedCodeData,
		(() => {
			const fileIsInCodePanes2 = $codePanes2.some((pane) => pane.fileId === $focusedFileId);
			const previouslyFocusedFileIsInCodePanes2 = $codePanes2.some(
				(pane) => pane.fileId === $previouslyFocusedFileId
			);

			if (!$derivedCodeData?.fileId) {
				return;
			}
			const derivedCodeDataId = `#split-${$derivedCodeData?.fileName}-${$derivedCodeData?.type}-${$derivedCodeData?.fileId}`;
			const idStringSplit = id.split('-');
			const codePaneFile = {
				paneID: derivedCodeDataId,
				label: $derivedCodeData?.fileName,
				...$derivedCodeData
			};

			if ($codePanes2?.length < 2) {
				if (derivedCodeDataId !== id) {
					// code = $derivedCodeData?.source;
					// type = $derivedCodeData?.type;
					// id = derivedCodeDataId;
					$codePanes2 = [codePaneFile];
				}
			} else if (!fileIsInCodePanes2 && previouslyFocusedFileIsInCodePanes2) {
				if ($previouslyFocusedFileId.toString() === idStringSplit[idStringSplit?.length - 1]) {
					const oldPaneIndex = $codePanes2.findIndex(
						(pane) => pane.fileId === $previouslyFocusedFileId
					);
					$codePanes2[oldPaneIndex] = codePaneFile;
				}
			}
		})();

	let options;

	$: options = {
		theme: 'omni-light',
		language: codeType,
		fontSize: 13,
		padding: { top: 30 },
		showFoldingControls: 'always',
		tabCompletion: 'on',
		wordWrap: 'off',
		scrollBeyondLastLine: true,
		autoClosingBrackets: 'languageDefined',
		autoClosingQuotes: 'beforeWhitespace',
		autoIndent: 'full',
		autoSurround: 'languageDefined',
		automaticLayout: true,
		minimap: {
			enabled: false
		},
		wrappingIndent: 'same',
		highlightActiveIndentGuide: true,
		fontLigatures: true
		// quickSuggestions: true,
		// suggestOnTriggerCharacters: true
		// fontWeight: "500",
		// formatOnType: true,
		// formatOnPaste: true,
		// lineNumbersMinChars: 2,
	};
</script>

<div style="height:100%;">
	<MonacoEditorScripts
		IFTitle={codeType === 'js' ? 'javascript' : codeType}
		bind:value={code}
		{options}
		on:update={(e) => {
			console.log('E::', e);
			openFiles.update((files) => {
				const file = files?.find((file) => {
					const newId = `#split-${file?.name}-${file?.type}-${file?.id}`;
					return newId === id;
				});

				if (file) {
					file.content = e?.detail?.value;
				}

				return files;
			});

			console.log('e::', e);

			fileStoreFiles.update((files) => {
				const file = files?.find((file) => {
					const newId = `#split-${file?.name}-${file?.type}-${file?.id}`;
					return newId === id;
				});

				if (file) {
					console.log('======================================');
					console.log('======================================');
					console.log('found::file::', file);
					console.log('======================================');
					console.log('======================================');
					file.content = e?.detail?.value;
					console.log('file::file.content::', file);
					console.log('======================================');
					console.log('======================================');
					const fileAlreadyInFilesToUpdate = $filesToUpdate?.some((fileToUpdate) => {
						return fileToUpdate?.id === file?.id;
					});

					console.log('fileAlreadyInFilesToUpdate::', fileAlreadyInFilesToUpdate);
					console.log('======================================');
					console.log('======================================');
					// if the file isnt already in the filesToUpdate array, add it
					if (!fileAlreadyInFilesToUpdate) {
						console.log('file not in filesToUpdate::', file);
						console.log('filesToUpdate::before_adding_file', $filesToUpdate);
						$filesToUpdate = [...$filesToUpdate, file];
						console.log('filesToUpdate::after_adding_file', $filesToUpdate);
					}

					if (fileAlreadyInFilesToUpdate) {
						$filesToUpdate = $filesToUpdate?.map((fileToUpdate) => {
							if (fileToUpdate?.id === file?.id) {
								if (fileToUpdate?.content !== file?.content) {
									fileToUpdate.content = file.content;
								}
							}

							return fileToUpdate;
						});
					}
				}

				return files;
			});
		}}
	/>
</div>
