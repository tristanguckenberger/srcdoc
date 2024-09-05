<script>
	// @ts-nocheck
	import { notifications } from '$lib/stores/notificationStore.js';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import { writable } from 'svelte/store';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	let fetchedNotifications = writable([]);
	let totalNotifications = 0;
	let limit = 10;
	let offset = 0;
	let loading = false;
	let observer;

	const getNotifications = async (limit, offset) => {
		const response = await fetch(
			`/api/notifications/byUser/${$platformSession?.currentUser?.id}?limit=${limit}&offset=${offset}`
		);
		const data = await response.json();
		return data;
	};

	const loadMoreNotifications = async () => {
		if (loading || offset >= totalNotifications) return;
		loading = true;
		const { notifications: newNotifications, total } = await getNotifications(limit, offset);
		fetchedNotifications.update((current) => [...current, ...newNotifications]);
		offset += limit;
		totalNotifications = parseInt(total);
		loading = false;
	};

	const observe = (entries) => {
		const entry = entries[0];
		if (entry.isIntersecting) {
			loadMoreNotifications();
		}
	};

	const setupObserver = () => {
		observer = new IntersectionObserver(observe, {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		});

		const endOfListElement = document.querySelector('#end-of-list');
		if (endOfListElement) {
			observer?.observe(endOfListElement);
		} else {
			console.error('#end-of-list element not found during setup');
		}
	};

	const reobserveEndOfList = () => {
		const endOfListElement = document.querySelector('#end-of-list');
		if (endOfListElement) {
			observer?.unobserve(endOfListElement); // Stop observing the current end-of-list
			observer?.observe(endOfListElement); // Re-observe the new end-of-list
		} else {
			console.error('#end-of-list element not found during reobserve');
		}
	};

	onMount(async () => {
		const initialData = await getNotifications(limit, offset);
		totalNotifications = parseInt(initialData?.total);
		fetchedNotifications.set(initialData?.notifications);
		offset += limit;
		if (initialData.notifications.length > 0) {
			setupObserver();
		}
	});

	afterUpdate(() => {
		reobserveEndOfList();
	});

	onDestroy(() => {
		if (observer) {
			observer?.disconnect();
		}
	});
</script>

<div class="notifications">
	{#if $fetchedNotifications?.length === 0}
		<div class="notification">No notifications yet</div>
	{:else}
		{#each $fetchedNotifications as notification (notification.id)}
			{#if notification?.id}
				<div class="notification">
					<div class="notification-details">
						<p class="timestamp">{new Date(notification.created_at).toLocaleString()}</p>
						<div class="activity-header">
							{#if notification?.sender_profile_photo}
								<img
									src={notification.sender_profile_photo}
									alt="User avatar"
									class="profile-photo"
								/>
							{:else}
								<div class="profile-photo">
									<ImagePlaceHolder />
								</div>
							{/if}
							<p class="primary-text">
								<a href="/users/{notification.sender_id}"
									>{notification.sender_username ?? 'A User'}</a
								>
								{#if notification?.type === 'favorite'}
									favorited your game
								{:else if notification?.type === 'comment'}
									commented on your game, <a href="/games/{notification.entity_id}"
										>{notification.entity_title}</a
									>
								{:else if notification?.type === 'follow'}
									followed you
								{:else if notification?.type === 'mention'}
									mentioned you in a post
								{:else if notification?.type === 'reply'}
									replied to your comment
								{:else if notification?.type === 'share'}
									shared your post
								{:else if notification?.type === 'system'}
									{notification.sender_username ?? 'A User'} sent you a system notification
								{/if}
							</p>
						</div>

						{#if notification.entity_type === 'game'}
							<a href="/games/{notification?.entity_id}/play" class="activity-link">
								<div class="game-details">
									{#if notification?.entity_thumbnail}
										<img
											src={notification.entity_thumbnail}
											alt="Game thumbnail"
											class="game-thumbnail"
										/>
									{:else}
										<div class="game-thumbnail">
											<ImagePlaceHolder />
										</div>
									{/if}
									<div class="game-info">
										<p class="game-title">{notification.entity_title}</p>
										<p class="game-description">{notification.entity_description}</p>
									</div>
								</div>
							</a>
						{/if}
						{#if notification.entity_type === 'comment'}
							<a href="/games/{notification?.entity_id}/play" class="activity-link">
								<div class="game-comment">
									<div class="comment-game-details">
										{#if notification?.entity_thumbnail}
											<img
												src={notification.entity_thumbnail}
												alt="Game thumbnail"
												class="game-thumbnail"
											/>
										{:else}
											<div class="game-thumbnail">
												<ImagePlaceHolder />
											</div>
										{/if}
										<div class="game-info">
											<p class="game-title">{notification.entity_title}</p>
											<p class="game-description">{notification.entity_description}</p>
										</div>
									</div>
									<div class="comment-details">
										<p class="comment-text">{notification.entity_primary_text}</p>
									</div>
								</div>
							</a>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
	{#if $fetchedNotifications?.length > 0}
		<div id="end-of-list" style="height: 20px;">
			{loading || offset <= totalNotifications ? 'Loading more...' : 'All caught up!'}
		</div>
		<br />
	{/if}
</div>

<style>
	.notifications {
		position: fixed;
		top: 56px;
		right: 10px;
		max-width: 400px;
		min-width: 200px;
		width: 40vw;
		display: flex;
		flex-direction: column;
		background-color: var(--user-accent-color);
		border-radius: 8px;
		box-shadow: 0 2px 10px 2px rgb(0 0 0 / 42%);
		height: calc(55%);
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.notification {
		color: var(--color-primary);
		padding: 1rem;
		margin: 0.5rem 0;
		border-radius: 5px;
		font-family: 'Source Sans 3', sans-serif;
		margin-block-start: 0;
		margin-block-end: 0;
	}
	.notification a {
		color: var(--color-primary);
		text-decoration: none;
	}
	.notification a:hover {
		text-decoration: underline;
	}
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

	/* .activity {
		height: fit-content;
		padding: 10px;
		color: var(--color-primary);
		display: flex;
		gap: 10px;
	} */

	.profile-photo {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid #a69160;
		overflow: hidden;
	}

	img.profile-photo {
		overflow: clip;
	}

	.notification-details {
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
		overflow: hidden;
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
	#end-of-list {
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-size: 1rem;
		text-align: center;
	}
</style>
