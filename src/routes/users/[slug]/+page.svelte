<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import Button from '$lib/ui/Button/index.svelte';
	import { sideBarState } from '$lib/stores/layoutStore.js';
	import Drawer from '$lib/ui/Drawer/index.svelte';
	import Widget from '$lib/ui/Widget/index.svelte';
	import { session } from '$lib/stores/sessionStore';
	import { drawerOpen, selectedOption } from '$lib/stores/drawerStore';
	import EditUserDetails from '$lib/ui/Modal/components/EditUserDetails.svelte';

	export let data;

	let imageLoaded = false;
	let reactiveData = {};
	let ComponentOptions = [];

	const handleFollow = () => {
		console.log('follow');
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
	$: themeString = $themeDataStore?.theme?.join(' ');

	$: console.log('reactiveData::', data);
</script>

<div class="user-info-container" class:showSideBar={$sideBarState} style={`${themeString}`}>
	<div class="user-info">
		<div class="user-header-image-container">
			<img
				class="user-header-image"
				class:showImage={imageLoaded}
				src={data?.headerImage ?? 'https://picsum.photos/2000/300'}
				on:load={() => {
					imageLoaded = true;
				}}
				alt="User Profile Header"
			/>
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
			<div class="user-header-placeholder" class:hidePlaceholder={imageLoaded} />
		</div>
		<div class="user-details">
			<div class="user-controls">
				<div class="main-action-container">
					<div class="user-header-image-container">
						<img
							class="user-header-image avatar"
							class:showImage={imageLoaded}
							src={data?.profile_photo ?? 'https://picsum.photos/2000/300'}
							on:load={() => {
								imageLoaded = true;
							}}
							alt="User Profile Avatar"
						/>
						<div class="user-header-placeholder avatar" class:hidePlaceholder={imageLoaded} />
					</div>
					<Button link={null} label={'Follow'} action={() => handleFollow} />
				</div>
			</div>
			<div class="user-text">
				<h1>{data?.username ?? ''}</h1>
				<p>
					{data?.bio ?? ''}
				</p>
			</div>
		</div>
	</div>
	<Drawer>
		<div slot="drawer-component" class="drawer-component">
			<Widget content={data} options={ComponentOptions} />
		</div>
	</Drawer>
</div>

<style>
	.user-info-container {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
	}
	.user-info-container.showSideBar {
		width: calc(100% - 230px);
	}
	.user-info {
		height: 100%;
		width: 40%;
		display: flex;
		flex-direction: column;
		min-width: 680px;
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
		border-radius: 6px;
		padding: 10px 0 10px 0;
	}
	.main-action-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 10px 0 10px 0;
		gap: 10px;
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
		margin-block-start: 0;
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
		width: 150px;
		height: 150px;
		object-fit: cover;
		border: 2px solid #4e4e4e;
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

	.user-info-container :global(.drawer-component) {
		width: 100%;
		height: 100%;
	}
	button.settings-action {
		position: absolute;
		top: 20px;
		right: 16px;
		z-index: 1000000000000000;
		background: unset;
		border-style: unset;
	}
	button.settings-action:hover {
		cursor: pointer;
	}
</style>
