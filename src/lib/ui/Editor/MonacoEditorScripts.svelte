<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { changingPage } from '$lib/stores/codeStore.js';
	import { isDarkModeStore } from '$lib/stores/layoutStore';

	export let IFTitle;
	export let value;
	export let options;

	let Monaco;
	let container;
	let editor;

	onMount(async () => {
		setTimeout(async () => {
			try {
				self.MonacoEnvironment = {
					getWorker: function (_moduleId, label) {
						if (label === 'json') {
							return new jsonWorker();
						}
						if (label === 'css' || label === 'scss' || label === 'less') {
							return new cssWorker();
						}
						if (label === 'html' || label === 'handlebars' || label === 'razor') {
							return new htmlWorker();
						}
						if (label === 'typescript' || label === 'js') {
							return new tsWorker();
						}
						return new editorWorker();
					}
				};
				Monaco = await import('monaco-editor');
				editor = Monaco.editor.create(container, {
					value,
					language: IFTitle,
					...options
				});
				// This breaks the editor
				// editor = Monaco.editor.defineTheme('omni-light', {
				// 	base: 'vs',
				// 	inherit: true,
				// 	rules: [],
				// 	colors: {
				// 		'editor.background': '#FBFBFB'
				// 	}
				// });
			} catch (error) {
				console.log('error', error);
			}
		}, 50);

		return () => {
			editor.dispose();
		};
	});
	afterUpdate(async () => {
		if (editor) {
			editor?.setValue(value);
		}
	});

	$: if ($isDarkModeStore) {
		if (Monaco) {
			Monaco.editor.defineTheme('omni-dark', {
				base: 'vs-dark',
				inherit: true,
				rules: [],
				colors: {
					'editor.background': '#373638'
				}
			});
			Monaco.editor.setTheme('omni-dark');
		}
	} else {
		// if (Monaco) {
		// 	Monaco.editor.defineTheme('omni-light', {
		// 		base: 'vs',
		// 		inherit: true,
		// 		rules: [],
		// 		colors: {
		// 			'editor.background': '#FBFBFB'
		// 		}
		// 	});
		// 	Monaco.editor.setTheme('vs');
		// }
	}

	const dispatch = createEventDispatcher();

	// TODO: Investigate monaco editor bugs
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
