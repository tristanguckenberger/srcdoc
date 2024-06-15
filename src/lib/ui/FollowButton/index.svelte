<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { afterUpdate, onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	import Button from '$lib/ui/Button/index.svelte';

	export let currentUserIsFollowingProfileUser = false;
	export let userId;
	let updating = false;

	let themeString = '';

	let currentUserIsProfileUser = false;

	onMount(async () => {
		userId = $page?.params?.slug;
	});

	afterUpdate(async () => {
		userId = $page?.params?.slug;
	});

	$: {
		console.log('currentUserIsFollowingProfileUser::', currentUserIsFollowingProfileUser);
		console.log('currentUserIsProfileUser::', currentUserIsProfileUser);
	}
</script>

<form
	class="settingsForm"
	method="POST"
	action="/?/{currentUserIsFollowingProfileUser ? 'unfollowUser' : 'followUser'}"
	enctype="multipart/form-data"
	use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
		formData.set('userId', userId);

		updating = true;

		return async ({ update, result }) => {
			await update();
			setTimeout(async () => {
				updating = false;
				await invalidateAll();
			}, 500);
		};
	}}
>
	<Button
		bind:creating={updating}
		label={currentUserIsFollowingProfileUser ? 'Unfollow' : 'Follow'}
		isRounded
		style="background-color: #6495ED; margin-top: 60px;"
	/>
</form>
