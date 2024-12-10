<script>
	import UserListCard from './UserListCard.svelte';
	import FollowButton from '$lib/ui/FollowButton/index.svelte';
	

	/**
	 * @typedef {Object} Props
	 * @property {any} userList - import { getContext } from 'svelte'; - const { following } = getContext('followDataStore');
	 */

	/** @type {Props} */
	let { userList } = $props();

	
</script>

<div class="playlist-container">
	{#each userList as user}
		{#if user?.id}
			<div class="single-playlist-container">
				<UserListCard {user} thumbnail={user?.profile_photo}>
					{#snippet followsButton()}
										<div >
							<FollowButton userId={user?.id} />
						</div>
									{/snippet}
				</UserListCard>
			</div>
		{/if}
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
