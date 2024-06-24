<script>
	import UserListCard from './UserListCard.svelte';
	import FollowButton from '$lib/ui/FollowButton/index.svelte';
	// import { getContext } from 'svelte';

	export let userList;

	// const { following } = getContext('followDataStore');
</script>

<div class="playlist-container">
	{#each userList as user}
		<div class="single-playlist-container">
			<UserListCard {user} thumbnail={user?.profile_photo}>
				<div slot="followsButton">
					<FollowButton userId={user?.id} />
				</div>
			</UserListCard>
		</div>
	{/each}
</div>

<style>
	.single-playlist-container {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		padding: 0 10px;
		transition: background 0.2s linear(0.07 -1.12%, 1 100%);
	}
	.playlist-container {
		width: 100%;
	}
</style>
