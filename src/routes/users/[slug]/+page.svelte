<script>
	// @ts-nocheck
	import { themeDataStore } from '$lib/stores/themeStore.js';
	import Button from '$lib/ui/Button/index.svelte';

	export let data;

	const handleFollow = () => {
		console.log('follow');
	};

	$: themeString = $themeDataStore?.theme?.join(' ');
	let imageLoaded = false;
</script>

<div class="user-info-container" style={`${themeString}`}>
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
					<!-- <Button link={`/users/${data?.id}/engine`} label={'Open in Engine'} /> -->
					<Button link={null} label={'Follow'} action={() => handleFollow} />
				</div>
			</div>
			<div class="user-text">
				<h1>{data?.username}</h1>
				<p>
					{data?.bio}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.user-info-container {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
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
		padding: 10px 0 10px 10px;
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
</style>
