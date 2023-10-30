<script>
	// THIS IS THE NEW EDITOR??
	// @ts-nocheck
	import { htmlStore, cssStore, jsStore } from '$lib/stores/codeStore.js';
	import { openFiles } from '$lib/stores/filesStore.js';
	import MonacoEditorScripts from './MonacoEditorScripts.svelte';
	import { baseDataStore, derivedCodeData } from '$lib/stores/filesStore.js';
	import { saveFile, focusedFileId } from '$lib/stores/filesStore.js';
	export let code;

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

	let options;

	$: options = {
		theme: 'omni-light',
		language: code?.type,
		fontSize: 13,
		padding: { top: 30 },
		showFoldingControls: 'always',
		tabCompletion: 'on',
		wordWrap: 'on',
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
		// fontWeight: "500",
		// formatOnType: true,
		// formatOnPaste: true,
		// lineNumbersMinChars: 2,
	};
</script>

<div style="height:100%;">
	<MonacoEditorScripts
		IFTitle={codeType}
		bind:value={code}
		{options}
		on:update={(e) => {
			// Planning to have up to 3 stores for each code type
			// and 3 stores max
			// The stores need to be updated frequently, hence the use of the on:update event

			// edge cases:

			// I open a new file, there are no open windows:
			// - the file will need to be added to the open files store
			// - the file will need to be added to the code panes store
			// - the file will need to be updated on every keystroke

			// if the file is in the open files store
			// if the file is in the code panes store
			// if the file

			// - if the user is editing a file, the file will need to be updated on every keystroke
			// as will the full srcdoc store (combined project code)

			// - if the user opens a new file,

			// There will be one store that combines all project code
			//
			//
			// if the user is editing a file, the file will need to be
			// updated on every keystroke as will the full srcdoc store (combined project code)

			// update the focused file in the open files store
			$openFiles.update((files) => {
				const file = files.find((file) => file.id === code?.id);
				if (file) {
					file.source = e?.detail?.value;
				}
				return files;
			});

			// if (code?.type === 'html') {
			// 	htmlStore.set({ source: e?.detail?.value, type: 'html' });
			// }
			// if (code?.type === 'css') {
			// 	cssStore.set({ source: e?.detail?.value, type: 'css' });
			// }
			// if (code?.type === 'js') {
			// 	jsStore.set({ source: e?.detail?.value, type: 'typescript' });
			// }

			// using the file id, update the file localstorage
		}}
	/>
</div>
