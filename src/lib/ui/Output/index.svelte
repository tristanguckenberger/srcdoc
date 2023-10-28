<script>
	// @ts-nocheck
	import buildDoc from '$lib/srcdoc';
	import { htmlStore, cssStore, jsStore } from '$lib/stores/codeStore.js';
	import { afterUpdate } from 'svelte';

	let id = 0;
	let srcdocBuilt;
	let iframe;

	afterUpdate(() => {
		if (iframe) {
			srcdocBuilt = buildDoc($htmlStore, $cssStore, $jsStore);
			iframe.srcdoc = srcdocBuilt;
			id++;
		}
	});
</script>

<div style="height: 100%; flex-grow: 1;">
	{#if id}
		<iframe
			id={`output-iframe-${id}`}
			style="border-radius: 6px; -webkit - mask - image: -webkit - radial - gradient(white, black);"
			title="result"
			bind:this={iframe}
			sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
		/>
	{/if}
</div>

<style>
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}
</style>
