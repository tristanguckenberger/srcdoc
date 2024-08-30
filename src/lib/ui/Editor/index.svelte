<script>
	// @ts-nocheck
	import {
		autoCompile,
		initialDataStore,
		baseDataStore,
		openFiles
	} from '$lib/stores/filesStore.js';
	import MonacoEditorScripts from './MonacoEditorScripts.svelte';
	import {
		derivedCodeData,
		codePanes2,
		focusedFileId,
		previouslyFocusedFileId,
		fileStoreFiles,
		filesToUpdate
	} from '$lib/stores/filesStore.js';
	import { onDestroy, onMount, tick } from 'svelte';

	export let readonly = false;
	export let id;
	export let code;
	export let type;

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

	// Add this in the onMount lifecycle hook or another suitable place
	onMount(() => {
		// Attach event listener
		// window?.addEventListener('keydown', handleKeyDown);
		// // Cleanup
		// return () => {
		// 	window.removeEventListener('keydown', handleKeyDown);
		// };
	});

	onDestroy(() => {
		// Cleanup
		// window?.removeEventListener('keydown', handleKeyDown);
	});

	$: codeType = type;

	$: if ($focusedFileId && $previouslyFocusedFileId && $codePanes2?.length) {
		$derivedCodeData,
			(() => {
				try {
					const fileIsInCodePanes2 = $codePanes2.some(
						(pane) => pane?.fileId?.toString() === $focusedFileId?.toString()
					);
					const previouslyFocusedFileIsInCodePanes2 = $codePanes2.some(
						(pane) => pane?.fileId?.toString() === $previouslyFocusedFileId?.toString()
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
						if (derivedCodeDataId?.toString() !== id?.toString()) {
							// code = $derivedCodeData?.source;
							// type = $derivedCodeData?.type;
							// id = derivedCodeDataId;
							$codePanes2 = [codePaneFile];
						}
					} else if (!fileIsInCodePanes2 && previouslyFocusedFileIsInCodePanes2) {
						if (
							$previouslyFocusedFileId?.toString() ===
							idStringSplit[idStringSplit?.length - 1]?.toString()
						) {
							const oldPaneIndex = $codePanes2.findIndex(
								(pane) => pane?.fileId?.toString() === $previouslyFocusedFileId?.toString()
							);
							$codePanes2[oldPaneIndex] = codePaneFile;
						}
					}
				} catch (error) {
					console.log('error::', error);
				}
			})();
	}

	let options;

	$: $autoCompile = readonly;

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
		fontLigatures: true,
		FontFace: 'Fira Code'
		// quickSuggestions: true,
		// suggestOnTriggerCharacters: true
		// fontWeight: "500",
		// formatOnType: true,
		// formatOnPaste: true,
		// lineNumbersMinChars: 2,
	};

	let updateQueue = [];

	async function processUpdateQueue() {
		while (updateQueue.length > 0) {
			const { files, updatedValue } = updateQueue.shift();

			// Perform the updates on the first item in the queue
			openFiles?.update((files) => {
				const file = files?.find((file) => file.id === id);
				if (file && file.content !== updatedValue) {
					file.content = updatedValue;
				}
				return files;
			});

			fileStoreFiles?.update((files) => {
				const file = files?.find((file) => file.id === id);
				if (file && file.content !== updatedValue) {
					file.content = updatedValue;
				}
				return files;
			});

			// Delay the next update to avoid blocking the main thread
			await new Promise((resolve) => setTimeout(resolve, 0));
		}
	}

	// Add to the queue and process asynchronously
	function queueUpdate(files, updatedValue) {
		updateQueue.push({ files, updatedValue });
		if (updateQueue.length === 1) {
			processUpdateQueue();
		}
	}

	function debounce(func, delay) {
		let debounceTimer;
		return function (...args) {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => func.apply(this, args), delay);
		};
	}

	function updateOpenFiles(fileUpdated, updatedValue) {
		return fileUpdated;
	}

	// const debouncedUpdate = debounce(, 0);
</script>

<div style="height:100%;">
	<MonacoEditorScripts
		IFTitle={codeType === 'js' ? 'javascript' : codeType}
		bind:value={code}
		{options}
		on:update={async (e) => {
			await tick();
			try {
				if (readonly) {
					console.log('readonly::e::', e);
					return; // Early return if readonly, no need to continue processing.
				}

				const updatedValue = e?.detail?.value;
				let fileUpdated = false; // Flag to check if any file was updated.

				// Isolate each file-pane combination by using a unique identifier.
				const updateOpenFiles = async () => {
					const file = $openFiles?.find((file) => {
						const newId = `#split-${file?.name}-${file?.type}-${file?.id}`;
						return newId === id;
					});
					if (file && file.content !== updatedValue) {
						file.content = updatedValue;
						$openFiles = [...$openFiles]; // Force the store to update
						fileUpdated = true;
					}
				};

				await updateOpenFiles();

				if (!fileUpdated) return; // No file was updated, no need to update fileStoreFiles or filesToUpdate.

				const updateFileStoreFiles = async () => {
					const file = $fileStoreFiles?.find((file) => {
						const newId = `#split-${file?.name}-${file?.type}-${file?.id}`;
						return newId === id;
					});

					if (file.content !== updatedValue) {
						file.content = updatedValue;
						// Check if the file should be added to $filesToUpdate
						const shouldFileBeAdded = $initialDataStore?.files?.some((initialFile) => {
							return initialFile?.id === file?.id && initialFile?.content !== file?.content;
						});

						// Ensure the file is not already in $filesToUpdate
						const fileAlreadyInFilesToUpdate = $filesToUpdate?.some(
							(fileToUpdate) => fileToUpdate?.id === file?.id
						);

						if (shouldFileBeAdded && !fileAlreadyInFilesToUpdate) {
							$filesToUpdate = [...$filesToUpdate, file];
						} else if (fileAlreadyInFilesToUpdate) {
							$filesToUpdate = $filesToUpdate?.map((fileToUpdate) => {
								if (fileToUpdate?.id === file?.id && fileToUpdate?.content !== updatedValue) {
									fileToUpdate.content = updatedValue;
								}
								return fileToUpdate;
							});
						}
					}
				};

				await updateFileStoreFiles();

				const fileToUpdate = $filesToUpdate?.find(
					(file) => file?.id?.toString() === $focusedFileId?.toString()
				);
			} catch (error) {
				console.error('error::', error); // Use console.error for errors
			}
		}}
	/>
</div>
