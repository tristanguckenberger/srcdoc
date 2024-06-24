<script>
	// @ts-nocheck
	import { onMount, setContext, getContext } from 'svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import UserList from '$lib/ui/UserList/index.svelte';
	import { writable } from 'svelte/store';

	export let userId;

	let userList = [];
	let showFollowers = true;

	setContext('followDataStore', { followers: writable([]), following: writable([]) });
	const { followers, following } = getContext('followDataStore');

	const getFollowers = async () => {
		const followersResponse = await fetch(
			`/api/follows/${$platformSession?.currentUser?.id}/followers`
		);
		if (followersResponse.ok) {
			$followers = await followersResponse.json();
		}
	};

	const getFollowing = async () => {
		const followingResponse = await fetch(
			`/api/follows/${$platformSession?.currentUser?.id}/following`
		);
		if (followingResponse.ok) {
			$following = await followingResponse.json();
		}
	};

	const toggleFollowsType = async (booVal) => {
		showFollowers = booVal !== undefined ? booVal : !showFollowers;

		if (showFollowers) {
			if (followers.length === 0) {
				await getFollowers();
			}
			userList = [...$followers];
		} else {
			if (following.length === 0) {
				await getFollowing();
			}
			userList = [...$following];
		}
	};

	onMount(async () => {
		if ($platformSession?.currentUser?.id) {
			await getFollowers();
			await getFollowing();
			userList = showFollowers ? [...$followers] : [...$following];
		}
	});

	let currentUserIsFollowingProfileUser = false;

	$: currentUserIsFollowingProfileUser = $followers?.some(
		(follower) => follower?.id?.toString() === $platformSession?.currentUser?.id?.toString()
	);
</script>

<slot name="header" />
<nav class="userListControl">
	<button
		class="swapBtn"
		class:active={showFollowers}
		on:click|preventDefault={() => toggleFollowsType(true)}>Followers</button
	>
	<button
		class="swapBtn"
		class:active={!showFollowers}
		on:click|preventDefault={() => toggleFollowsType(false)}>Following</button
	>
</nav>

{#if showFollowers}
	<div class="slidingContainer">
		<UserList {currentUserIsFollowingProfileUser} {userList} />
	</div>
{:else}
	<div class="slidingContainer">
		<UserList {currentUserIsFollowingProfileUser} {userList} />
	</div>
{/if}

<style>
	.userListControl {
		display: flex;
		justify-content: center;
		gap: 10px;
		padding: 0 20px;
		align-self: center;
	}
	.slidingContainer {
		width: 100%;
	}
	h3 {
		color: var(--color-primary);
	}
	button.swapBtn {
		background-color: unset;
		color: var(--color-primary);
		border: none;
		/* border-radius: 6px; */
		padding: 10px;
		cursor: pointer;
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1.5vmin;
		border-bottom: 2px solid transparent;
	}
	button.swapBtn.active {
		color: var(--color-accent);
		border-bottom: 2px solid var(--color-accent);
	}
</style>
