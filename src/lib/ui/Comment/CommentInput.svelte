<script>
	// @ts-nocheck
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import { writable } from 'svelte/store';

	const commentText = writable('');
</script>

<div class="comment-input">
	<CustomInput bind:inputText={$commentText} />
</div>

<style>
</style>
