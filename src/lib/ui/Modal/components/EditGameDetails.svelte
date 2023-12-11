<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { modalState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';

	export let gameId;
	export let title;
	export let description;
	export let headerImage;

	let newTitle = title;
	let newDescription = description;
	let newHeaderImage = headerImage;

	// const updateGameDetails = async () => {
	//     const response = await fetch(`/api/games/${gameId}`, {
	//         method: 'PUT',
	//         headers: {
	//             'Content-Type': 'application/json'
	//         },
	//         body: JSON.stringify({
	//             title: newTitle,
	//             description: newDescription,
	//             headerImage: newHeaderImage
	//         })
	//     });
	//     const data = await response.json();
	//     console.log('data::', data);
	// };
</script>

<form
	class="gameDetails new-project-form modal"
	method="POST"
	action="/games/?/updateDetails"
	use:enhance
>
	<CustomInput inputCapture={'title'}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput>
	<input type="text" hidden value={gameId} class="modal" />
	<Button label="Update Details" isRounded />
</form>

<style>
	form {
		padding: 20px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 30px;
		max-height: 50vh;
	}

	form.gameDetails :global(button) {
		background-color: #283e5e;
	}

	form.gameDetails :global(button:hover) {
		background-color: #283e5e !important;
	}
</style>
