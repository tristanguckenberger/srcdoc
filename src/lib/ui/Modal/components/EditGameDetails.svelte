<script>
	// @ts-nocheck
	import { enhance, applyAction } from '$app/forms';
	import { modalProps, modalState, modalOpenState } from '$lib/stores/layoutStore.js';
	import CustomInput from '$lib/ui/Input/CustomInput.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { goto } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';
	import { invalidate, invalidateAll } from '$app/navigation';

	export let gameId = $modalProps?.gameId;
	export let title = $modalProps?.title;
	export let description = $modalProps?.description;
	export let headerImage;

	$: console.log('EditGameDetails::gameId::', gameId);

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
	use:enhance={({ formElement, formData, action, cancel, redirect }) => {
		const gameId = formData.get('gameId');
		console.log('enhance::gameId::', gameId);
		return async ({ result }) => {
			if (result.status === 200) {
				modalOpenState.set(false);
				invalidateAll();
			} else {
				await applyAction(result);
			}
		};
	}}
>
	<CustomInput inputCapture={'title'} inputText={title}>
		<span slot="label" class="input-label modal">Title</span>
	</CustomInput>
	<CustomInput inputCapture={'description'} inputText={description}>
		<span slot="label" class="input-label modal">Description</span>
	</CustomInput>
	<CustomInput inputCapture={'gameId'} inputText={gameId} hidden />
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
