<script>
	// @ts-nocheck
	import { onMount, setContext, getContext } from 'svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import FollowButton from '$lib/ui/FollowButton/index.svelte';
	import UserList from '$lib/ui/UserList/index.svelte';
	import { writable } from 'svelte/store';

	export let userId;

	// let followers = [];
	// let following = [];
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
	<button on:click|preventDefault={() => toggleFollowsType(true)}>Followers</button>
	<button on:click|preventDefault={() => toggleFollowsType(false)}>Following</button>
</nav>
<UserList {currentUserIsFollowingProfileUser} {userList} />

<style>
	.userListControl {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
	.title {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-weight: 600;
	}
	.userListContainer {
		display: flex;
		flex-direction: column;
		gap: 10px;
		background-color: var(--menu-bg);
		width: 100%;
		padding: 10px;
	}
	.userListItem {
		display: flex;
		gap: 10px;
		padding: 10px 20px;
		align-items: center;
		border-radius: 6px;
	}
	.userListItem p {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 3vmin;
	}
	@media (max-width: 420px) {
		.userListItem p {
			font-size: 5vmin;
		}
	}
	.avatar {
		border-radius: 50%;
		max-height: 10vmin;
		height: 10vmin;
		width: 10vmin;
	}
</style>
