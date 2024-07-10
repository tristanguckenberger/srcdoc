<script>
	// @ts-nocheck
	import { getContext, onDestroy, onMount, setContext, tick } from 'svelte';
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import Button from '$lib/ui/Button/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';
	import EditUserDetails from '$lib/ui/Modal/components/EditUserDetails.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { afterUpdate } from 'svelte';
	import FollowButton from '$lib/ui/FollowButton/index.svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import HorizontalList from '$lib/ui/HorizontalList/index.svelte';
	import PlaylistCard from '$lib/ui/PlaylistCard/index.svelte';
	import AccountVerificationNotice from '$lib/ui/AccountVerificationNotice/index.svelte';

	export let data;

	let imageLoaded = false;
	let reactiveData = {};
	let ComponentOptions = [];
	let updating = false;
	let currentUser;

	let activities = writable(data.activities);
	let totalActivities = data.total;
	let limit = 50;
	let offset = data.activities.length;
	let loading = false;
	let observer;

	setContext('followDataStore', {
		followers: writable([]),
		following: writable([]),
		user: writable({})
	});
	const { followers, following, user } = getContext('followDataStore');

	setContext('playlistContext', {
		mousedOverItemId: writable(null),
		showPlayButtonStore: writable(false)
	});

	onMount(async () => {
		$followers = data?.followers;
		$following = data?.following;
		$user = data?.user;
		currentUser = data?.currentUser;

		setupObserver();
	});

	afterUpdate(() => {
		$followers = data?.followers;
		$following = data?.following;
		$user = data?.user;
		currentUser = data?.currentUser;
		reobserveEndOfList();
	});

	onDestroy(() => {
		$followers = [];
		$following = [];
		$user = {};
		currentUser = {};
		if (observer) {
			observer.disconnect();
		}
	});

	const setupObserver = () => {
		observer = new IntersectionObserver(observe, {
			root: null,
			rootMargin: '0px',
			threshold: 0.1 // Adjust threshold value here if needed
		});

		const endOfListElement = document.querySelector('#end-of-list');
		if (endOfListElement) {
			observer.observe(endOfListElement);
		} else {
			console.error('#end-of-list element not found during setup');
		}
	};

	const loadMoreActivities = async () => {
		if (loading || offset >= totalActivities) return;
		loading = true;
		const response = await fetch(`/api/activity/${data.id}?limit=${limit}&offset=${offset}`);
		const result = await response.json();
		activities.update((current) => [...current, ...result.activities]);
		offset += limit;
		loading = false;
	};

	const observe = (entries, observer) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				loadMoreActivities();
			}
		}
	};

	const reobserveEndOfList = () => {
		const endOfListElement = document.querySelector('#end-of-list');
		if (endOfListElement) {
			observer.unobserve(endOfListElement); // Stop observing the current end-of-list
			observer.observe(endOfListElement); // Re-observe the new end-of-list
		} else {
			console.error('#end-of-list element not found during reobserve');
		}
	};

	$: (() => {
		return (ComponentOptions = [
			{
				name: 'EditUserDetails',
				props: {
					id: data?.id,
					username: data?.username,
					bio: data?.bio,
					profile_photo: Boolean(data?.profile_photo) && `${data?.profile_photo}`
				},
				component: EditUserDetails
			}
		]);
	})();
	$: data?.user, (reactiveData = data?.user ?? {});
	$: userId = $page?.params?.slug;
	$: themeString = $themeDataStore?.theme?.join(' ');
	$: loadedHeader = data?.header ?? 'https://picsum.photos/2000/300';
	$: loadedProfilePhoto = data?.profile_photo ?? 'https://picsum.photos/2000/300';
	$: currentUserIsProfileUser =
		$platformSession?.currentUser?.id?.toString() === userId?.toString();
	$: currentUserIsFollowingProfileUser = $followers?.some(
		(followerUser) => followerUser?.id?.toString() === $platformSession?.currentUser?.id?.toString()
	);
	$: followerCount = $followers?.length ?? 0;
	$: followingCount = $following?.length ?? 0;
</script>

<div class="user-layout-container">
	{#if !data?.isActive && $platformSession?.currentUser?.id}
		<AccountVerificationNotice />
	{/if}
	<div class="user-profile-container" class:showSideBar={$sideBarState} style={`${themeString}`}>
		<div class="user-info-container">
			<div class="user-details">
				<div class="user-controls">
					<div class="main-action-container">
						<div class="user">
							<div class="user-header-image-container">
								<img
									class="user-header-image avatar"
									class:showImage={data?.profile_photo}
									src={loadedProfilePhoto}
									alt="User Profile Avatar"
								/>
								<div
									class="user-header-placeholder avatar"
									class:hidePlaceholder={data?.profile_photo}
								/>
							</div>
							<span class="username">{data?.username ?? ''}</span>
						</div>
						{#if currentUserIsProfileUser}
							<button
								class="settings-action"
								class:drawerOpen={$drawerOpen}
								on:click={() => {
									browser && selectedOption.set(0);
									drawerOpen.set(true);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="36"
									height="36"
									fill="#ffffff"
									viewBox="0 0 256 256"
									class="action-button-icon"
									><path
										d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
									/></svg
								>
							</button>
						{/if}
						{#if !currentUserIsProfileUser}
							<FollowButton
								{currentUserIsFollowingProfileUser}
								{userId}
								following={followers}
								isUserProfile={true}
							/>
						{/if}
					</div>
				</div>
				<div class="user-text">
					<p>
						{data?.bio ?? ''}
					</p>
				</div>
				<div class="user-stats">
					<div class="user-stat">
						<span class="count">{followerCount}</span>
						<span class="label">Followers</span>
					</div>
					<div class="user-stat">
						<span class="count">{followingCount}</span>
						<span class="label">Following</span>
					</div>
				</div>
			</div>

			<h3 class="header-title">Latest Activity</h3>

			<!-- <form action=""></form> -->
			<div class="user-activity">
				{#if $activities.length === 0}
					<p>No activity yet</p>
				{:else}
					{#each $activities as activity}
						<div class="activity">
							<div class="activity-details">
								<p class="timestamp">{new Date(activity.timestamp).toLocaleString()}</p>
								<div class="activity-header">
									<img
										src={activity.profile_photo}
										alt="User profile photo"
										class="profile-photo"
									/>
									<p class="primary-text">{activity.primary_text}</p>
								</div>
								{#if activity.target_type === 'game' || activity.target_type === 'game_session'}
									<a href="/games/{activity?.target_id}/play" class="activity-link">
										<div class="game-details">
											<img
												src={activity.game_thumbnail}
												alt="Game thumbnail"
												class="game-thumbnail"
											/>
											<div class="game-info">
												<p class="game-title">{activity.game_title}</p>
												<p class="game-description">{activity.game_description}</p>
											</div>
										</div>
									</a>
								{/if}
								{#if activity.target_type === 'comment'}
									<a href="/games/{activity?.comment_game_id}/play" class="activity-link">
										<div class="game-comment">
											<div class="comment-game-details">
												<img
													src={activity.game_thumbnail}
													alt="Game thumbnail"
													class="game-thumbnail"
												/>
												<div class="game-info">
													<p class="game-title">{activity.game_title}</p>
													<p class="game-description">{activity.game_description}</p>
												</div>
											</div>
											<div class="comment-details">
												<p class="comment-text">{activity.comment_text}</p>
											</div>
										</div>
									</a>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
				{#if $activities?.length > 0}
					<div id="end-of-list" style="height: 20px;">
						{loading || offset <= totalActivities ? 'Loading more...' : 'End of list!'}
					</div>
				{/if}
			</div>
		</div>

		<div class="user-content-container">
			<HorizontalList
				title="Favorites"
				subtitle={currentUserIsProfileUser ? 'Your Favorites' : `${data.username}'s Favorites`}
				type={'favorites'}
				link={'/games/favorites'}
				userId={data?.id}
			/>
			<HorizontalList
				title="Games"
				subtitle={currentUserIsProfileUser ? 'Your Games' : `${data?.username}'s Published Games`}
				type={'projects'}
				userId={data?.id}
				link={`/users/${data?.id}/games`}
			/>
			<h3>Playlists</h3>
			<h4>{currentUserIsProfileUser ? 'Your Playlists' : `${data.username}'s Playlists`}</h4>
			<div class="playlist-container">
				{#each data?.userPlaylists as playlist}
					<div class="single-playlist-container">
						<PlaylistCard id={playlist.id} {playlist} thumbnail={playlist?.thumbnail} />
					</div>
				{/each}
			</div>
		</div>
		<Drawer>
			<div slot="drawer-component" class="drawer-component">
				<Widget content={data} options={ComponentOptions} />
			</div>
		</Drawer>
	</div>
</div>

<style>
	:global(#editor-layout) {
		margin-bottom: 30px;
	}
	div.user-layout-container {
		display: flex;
		gap: 10px;
		border-radius: 8px;
		overflow: hidden;
		flex-direction: column;
	}
	div.user-layout-container :global(.notice-container) {
		border-radius: 8px;
		width: unset;
	}
	div.user-profile-container {
		height: 100%;
		width: 100%;
		display: flex;
		gap: 10px;
		flex-direction: row-reverse;
	}
	.user-info-container {
		height: calc(100% - 35px);
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-width: 25vmax;
	}
	.user-content-container {
		height: calc(100% - 55px);
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		background-color: var(--color-secondary);
		background: var(--home-gradient-color-2);
		background: linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -moz-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -webkit-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		border-radius: 8px;
		padding: 10px;
		width: 90%;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.user-header-image-container {
		width: 100%;
		position: relative;
	}
	.user-header-image {
		width: 100%;
		height: 250px;
		object-fit: cover;
		border-radius: 6px;
		display: none;
	}
	.user-header-image.showImage {
		display: block;
	}
	.user-details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background-color: var(--color-secondary);
		background: var(--home-gradient-color-2);
		background: linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -moz-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		background: -webkit-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		border-radius: 8px;
		padding: 20px;
	}
	.main-action-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 10px 0 10px 0;
		gap: 10px;
		justify-content: space-between;
		align-items: center;
	}
	/* .user-controls {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 10px;
	} */
	.user-text h1 {
		font-family: var(--header-font);
		color: var(--text-color-primary);
		margin-block-start: 0;
		font-weight: 400;
	}
	.user-text p {
		color: var(--text-color-primary);
		margin-block-start: 1vmax;
		font-family: 'Source Sans 3', sans-serif;
		padding: 0 10px 10px 10px;
	}
	.user-header-placeholder {
		width: 100%;
		height: 250px;
		border-radius: 6px;
		background-color: var(--folder-button-color);
	}
	.user-header-placeholder.hidePlaceholder {
		display: none;
	}
	.avatar {
		border-radius: 50%;
		width: 50px;
		height: 50px;
		object-fit: cover;
		border: 2px solid #a69160;
		color: #e3f1f6;
	}
	@media (max-width: 700px) {
		.user-info {
			width: 80%;
			min-width: 250px;
		}
		.avatar {
			width: 100px;
			height: 100px;
		}
		.user-details {
			transform: translateY(-95px);
		}
	}
	@media (max-width: 490px) {
		.avatar {
			width: 60px;
			height: 60px;
		}
	}

	.user-profile-container :global(.drawer-component) {
		width: 100%;
		height: 100%;
	}
	button.settings-action {
		position: relative;
		top: -20px;
		right: -10px;
		background: unset;
		border-style: unset;
	}
	button.settings-action:hover {
		cursor: pointer;
	}
	div.user {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}
	.single-playlist-container {
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		padding: 0 10px;
		transition: background 0.2s linear(0.07 -1.12%, 1 100%);
	}
	.playlist-container :global(.playlist .card-info p) {
		white-space: pre;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
		width: 200px;
	}
	h3,
	h4 {
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		margin-block-end: 0;
		color: var(--color-primary);
		padding-left: 10px;
	}
	h3 {
		font-size: 1.5rem;

		margin-block-start: 40px;
	}

	h4 {
		font-size: 1rem;
		margin-block-start: 10px;
		margin-block-end: 10px;
	}

	/* ACTIVITY FEED */
	.user-activity {
		height: 100%;
		gap: 2vmax;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
		background: -webkit-linear-gradient(
			270deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		border-radius: 8px;
		/* box-shadow: inset 0px 0px 20px 16px rgba(0, 0, 0, 0.2); */
	}

	.activity {
		height: fit-content;
		padding: 10px;
		/* background-color: var(--text-box); */
		color: var(--color-primary);
		display: flex;
		gap: 10px;
	}

	.profile-photo {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #a69160;
	}

	.activity-details {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.primary-text {
		/* font-weight: bold; */
		font-family: 'Source Sans 3', sans-serif;
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.game-details,
	.comment-details {
		display: flex;
		gap: 10px;
		padding: 10px;
		background-color: var(--list-item-bg-default);
		border-radius: 6px;
		color: var(--color-primary);
	}

	.game-thumbnail {
		width: 50px;
		height: 50px;
		border-radius: 6px;
		object-fit: cover;
	}

	.game-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.game-title {
		/* font-weight: bold; */
		margin-block-start: 0;
		margin-block-end: 0;
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1.1rem;
		font-weight: 500;
	}
	.game-description {
		margin-block-start: 0;
		margin-block-end: 0;
		font-size: 0.85rem;
		font-family: 'Source Sans 3', sans-serif;
	}
	.game-description,
	.comment-text,
	.timestamp {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.activity-header {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
	}
	.activity-link {
		text-decoration: none;
		color: var(--color-primary);
	}
	.comment-game-details {
		display: flex;
		gap: 10px;
		padding: 10px;
		background-color: var(--list-item-bg-default);
		border-radius: 6px;
		color: var(--color-primary);
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
	.comment-details {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
		/* padding: 0 10px 10px 10px; */
		box-shadow: inset 0px 0px 20px 16px rgba(0, 0, 0, 0.2);
	}

	/* Profile Info Layout and Styles */
	span.username {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1.75rem;
		font-weight: 500;
		color: var(--color-primary);
	}
	.user-stats {
		display: flex;
		flex-direction: row;
		gap: 10px;
		width: 50%;
		max-width: 250px;
		min-width: 200px;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
	}

	.user-stats .label {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: var(--folder-button-color);
	}
	.user-stats .count {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: var(--color-primary);
	}
	.header-title {
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		color: var(--folder-button-color);
		margin-block-start: 0.5vmax;
		margin-block-end: 0.5vmax;
		text-align: center;
	}
	#end-of-list {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		text-align: center;
	}
</style>
