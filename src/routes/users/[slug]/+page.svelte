<script>
	// @ts-nocheck
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import Button from '$lib/ui/Button/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import { session } from '$lib/stores/sessionStore';
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

	export let data;

	let imageLoaded = false;
	let reactiveData = {};
	let ComponentOptions = [];
	let updating = false;
	let currentUser;

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
	});

	afterUpdate(() => {
		$followers = data?.followers;
		$following = data?.following;
		$user = data?.user;
		currentUser = data?.currentUser;
	});

	onDestroy(() => {
		$followers = [];
		$following = [];
		$user = {};
		currentUser = {};
	});

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
	$: console.log('data.activities', data?.activities);
	$: {
		// log $followers count
		console.log('followers count', $followers?.length);

		// log $following count
		console.log('following count', $following?.length);
	}
	$: followerCount = $followers?.length ?? 0;
	$: followingCount = $following?.length ?? 0;
</script>

<svelte:head>
	<meta name="google-adsense-account" content="ca-pub-9366274571597084" />
</svelte:head>

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
			{#if data?.activities.length === 0}
				<p>No activity yet</p>
			{:else}
				{#each data?.activities as activity}
					<div class="activity">
						<div class="activity-details">
							<p class="timestamp">{new Date(activity.timestamp).toLocaleString()}</p>
							<div class="activity-header">
								<img src={activity.profile_photo} alt="User profile photo" class="profile-photo" />
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

<style>
	div.user-profile-container {
		height: calc(100% - 86.5px);
		width: 100%;
		display: flex;
		gap: 10px;
	}
	.user-info-container {
		height: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-width: 25vmax;
	}
	.user-content-container {
		height: 100%;
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
		position: absolute;
		top: 20px;
		right: 16px;
		z-index: 1;
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
</style>
