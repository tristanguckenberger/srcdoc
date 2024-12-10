<script>
	import { run } from 'svelte/legacy';

	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import Button from '$lib/ui/Button/index.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} userId
	 * @property {boolean} [isUserProfile]
	 */

	/** @type {Props} */
	let { userId, isUserProfile = false } = $props();
	let updating = $state(false);

	const followData = getContext('followDataStore');

	const { followers, following, user } = followData;

	let currentUserIsFollowingProfileUser = $state(false);

	onMount(() => {
		currentUserIsFollowingProfileUser = $following?.some((followedUser) =>
			isUserProfile
				? followedUser?.id?.toString() === $platformSession?.currentUser?.id?.toString()
				: followedUser?.id?.toString() === userId?.toString()
		);
	});

	const getUser = async (/** @type {String} */ id) => {
		if (id) {
			const userReqHeaders = new Headers();
			userReqHeaders?.append(`content-type`, `application/json`);
			const userReqInit = {
				method: 'GET',
				headers: userReqHeaders
			};

			const userResponse = await fetch(`/api/users/${id}`, userReqInit);
			if (!userResponse.ok) {
				return {
					status: 401,
					body: {
						message: 'No User found with id provided'
					}
				};
			}

			const user = await userResponse.json();
			return user;
		}
	};

	run(() => {
		if (isUserProfile) {
			currentUserIsFollowingProfileUser = $followers?.some(
				(followerUser) =>
					followerUser?.id?.toString() === $platformSession?.currentUser?.id?.toString()
			);
		} else {
			currentUserIsFollowingProfileUser = $following?.some(
				(followedUser) => followedUser?.id?.toString() === userId?.toString()
			);
		}
	});
</script>

<form
	class="followUnfollowForm"
	method="POST"
	action={`/?/${currentUserIsFollowingProfileUser ? 'unfollowUser' : 'followUser'}`}
	enctype="multipart/form-data"
	use:enhance={async ({ formElement, formData, action, cancel, submitter }) => {
		formData.set('userId', userId);
		updating = true;

		return async ({ update, result, action }) => {
			await update();
			if (result?.status === 200) {
				if (action?.search?.includes('unfollowUser')) {
					// if the user is unfollowing the profile user, remove the profile user from the array $following
					$following = $following?.filter((followee) => followee.id !== userId);
				} else {
					if (!$following?.some((followee) => followee.id === userId)) {
						// check if the user followed exists already exists in the array $followers, if it does, copy it into the array $following
						$followers?.forEach(async (follower) => {
							if (follower.id === userId) {
								$following = [...$following, { ...follower }];
							} else {
								$following = [...$following, { ...user }];
							}
						});
					}
				}
			}
			setTimeout(() => {
				updating = false;
			}, 500);
		};
	}}
>
	<Button
		bind:creating={updating}
		label={currentUserIsFollowingProfileUser ? 'Unfollow' : 'Follow'}
		isRounded
		style="background-color: #6495ED;"
	/>
</form>

<style>
	.followUnfollowForm :global(button) {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: unset;
	}
</style>
