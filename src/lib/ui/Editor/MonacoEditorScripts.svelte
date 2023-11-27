<script>
	// @ts-nocheck
	import { afterUpdate, createEventDispatcher, onDestroy, onMount } from 'svelte';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { editorStore } from '$lib/stores/editorStore';
	import { themeKeyStore } from '$lib/stores/themeStore';

	export let IFTitle;
	export let value;
	export let options;

	let Monaco;
	let container;
	let editor = null;
	let models = null;

	$: if (IFTitle === 'js') {
		IFTitle = 'javascript';
	}
	$: model = editor?.getModel();
	$: uri = model?.uri;
	$: editorId = editor?._id;

	onMount(async () => {
		try {
			self.MonacoEnvironment = {
				getWorker: function (_moduleId, label) {
					if (label === 'js') {
						label = 'javascript';
					}
					if (label === 'json') {
						return new jsonWorker();
					}
					if (label === 'css' || label === 'scss' || label === 'less') {
						return new cssWorker();
					}
					if (label === 'html' || label === 'handlebars' || label === 'razor') {
						return new htmlWorker();
					}
					if (label === 'typescript' || label === 'javascript') {
						return new tsWorker();
					}
					return new tsWorker();
				}
			};
			Monaco = await import('monaco-editor');

			// Define light theme
			Monaco.editor.defineTheme('omni-light', {
				base: 'vs',
				inherit: true,
				rules: [],
				colors: {
					'editor.background': '#FBFBFB'
				}
			});

			// Define dark theme
			Monaco.editor.defineTheme('omni-dark', {
				base: 'vs-dark',
				inherit: true,
				rules: [],
				colors: {
					'editor.background': '#373638'
				}
			});
			// create editor, returns monaco editor instance
			// not to be confused with Monaco.editor
			// these are two different things and have
			// different methods
			// Check monaco editor api docs for more info
			editor = Monaco.editor.create(container, {
				value,
				language: IFTitle,
				...options
			});
			model = editor.getModel();

			Monaco.editor.setModelLanguage(model || editor.getModel(), IFTitle);
			Monaco?.editor?.setTheme(`omni-${$themeKeyStore || 'light'}`);
			Monaco.languages.registerCompletionItemProvider('javascript', {
				provideCompletionItems: (model, position) => {
					const defaultRange = new Monaco.Range(
						position.lineNumber,
						position.column - 1,
						position.lineNumber,
						position.column
					);

					return {
						suggestions: [
							{
								label: 'getAsset:: Play Engine::', // The function name you're replacing
								kind: Monaco.languages.CompletionItemKind.Function,
								insertText: `getAsset('')`, // The text to insert
								sortText: '0', // A sortText that ensures it comes before the defaults
								range: defaultRange,
								detail: 'Loads an asset from the asset manager (.png, .mp3, etc.)',
								documentation:
									'getAsset(path: string): Asset Name e.g. "assets/playerSprite.png", but just pass the name: getAsset("playerSprite"), Note: path is relative to the assets folder, and should not include the file extension.'
							},
							{
								label: 'getClientDimensions:: Play Engine::',
								kind: Monaco.languages.CompletionItemKind.Function,
								insertText: `getClientDimensions()`,
								sortText: '0',
								range: defaultRange,
								detail: 'Returns the width and height of the client window in an object',
								documentation:
									'getClientDimensions(): { width: number, height: number }, Note: This is the size of the client window. You can use this to make your game responsive.'
							},
							{
								label: 'getKeyPressEvent:: Play Engine::',
								kind: Monaco.languages.CompletionItemKind.Function,
								insertText: `getKeyPressEvent()`,
								sortText: '0',
								range: defaultRange,
								detail: 'Returns the key press event',
								documentation:
									'getKeyPressEvent(): { current: null, previous: null, pressed: false } Note: This is the key press event. You can use this to check if a key is pressed.'
							}
						]
					};
				}
			});
			models = Monaco.editor.getModels();
		} catch (error) {
			console.log('error', error);
		}
	});

	onDestroy(() => {
		editor && editor.dispose();
		model && model.dispose();
	});

	afterUpdate(async () => {
		let editorMatch;
		if ($editorStore === null && editor !== null) {
			// we want to track multiple editors
			editorStore.set([editor]);
		} else if ($editorStore?.length > 0 && editor !== null) {
			// if there's an editor in the editorStore
			// check if the saved editor in the editorStore is the same as the editor variable
			editorMatch = $editorStore.find(({ _id }) => {
				if (_id === editorId) {
					return true;
				}
			});

			// if it's not the same, then we'll add the editor to the editorStore
			if (!editorMatch && editor?._id !== 1) {
				editorStore.set([...$editorStore, editor]);
			}
		}

		if ($editorStore?.length === 1) {
			Monaco?.editor?.setModelLanguage(model || $editorStore[0]?.getModel(), IFTitle);
			$editorStore[0]?.setValue(value);
		}

		if (editorMatch) {
			Monaco?.editor?.setModelLanguage(model || editorMatch?.getModel(), IFTitle);
			editorMatch?.setValue(value);
		}
	});

	$: $editorStore,
		$themeKeyStore,
		(() => {
			if ($editorStore?.length > 1) {
				$editorStore.forEach((editor) => {
					if (editor?._id === editorId) {
						Monaco?.editor?.setTheme(`omni-${$themeKeyStore}`);
						editor?.setValue(value);
					}
				});
			} else {
				Monaco?.editor?.setTheme(`omni-${$themeKeyStore}`);
				$editorStore?.[0]?.setValue(value);
			}
		})();

	const dispatch = createEventDispatcher();
</script>

<div
	id={IFTitle}
	bind:this={container}
	on:keyup={() =>
		dispatch('update', {
			value: editor.getValue()
		})}
	style="height:100%;"
	role="textbox"
	tabindex="0"
/>

<style>
	:global(.view-lines.monaco-mouse-cursor-text, .active-line-number.line-numbers) {
		font-family: 'Fira Code', monospace !important;
	}
</style>
