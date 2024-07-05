<script>
	// @ts-nocheck
	/** Horizontal List - A component to display Horizontal List of content * preferably playlists,
	games, or users * * @prop {Array} items - An array of items to display * @prop {String} type - The type
	of items to display * @prop {String} title - The title of the list * @prop {String} subtitle - The subtitle
	of the list * @prop {String} link - The link to the full list grid */
	import { actionListHoverStore } from '$lib/stores/themeStore';
	import { afterUpdate, onMount } from 'svelte';
	import { platformSession } from '$lib/stores/platformSession';
	import ActionListCard from '$lib/ui/ActionListCard/index.svelte';

	export let type = '';
	export let title = '';
	export let subtitle = '';
	export let link = '';

	const colorMap = ['#523b3b', '#4f3b52', '#3b3e52', '#3b5242', '#524f3b', '#52483b', '#43484cb3'];
	let highlightedColor = null;
	let componentWidth;

	$: isMobile = componentWidth < 498;
	$: $actionListHoverStore = highlightedColor;

	function handleHover(e, index) {
		if (index === null) {
			highlightedColor = null;
			$actionListHoverStore = null;
			return;
		}
		highlightedColor = colorMap[index];
	}
</script>

<div class="action-list-container" bind:clientWidth={componentWidth}>
	<h3>{title}</h3>
	<h4>{subtitle}</h4>
	<div class="action-list">
		<!-- My Library or Auth -->
		<div
			class="list-item color-1"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 0)}
		>
			{#if $platformSession?.currentUser?.id}
				<ActionListCard
					id={0}
					title={'My Library'}
					subtitle={'Open your library'}
					cardLink={`/users/${$platformSession?.currentUser?.id}/library`}
					{isMobile}
				>
					<svg
						slot="leading-item"
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						fill="#ffffff"
						viewBox="0 0 256 256"
						><path
							d="M96,104a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H104A8,8,0,0,1,96,104Zm8,40h64a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16Zm128,48a32,32,0,0,1-32,32H88a32,32,0,0,1-32-32V64a16,16,0,0,0-32,0c0,5.74,4.83,9.62,4.88,9.66h0A8,8,0,0,1,24,88a7.89,7.89,0,0,1-4.79-1.61h0C18.05,85.54,8,77.61,8,64A32,32,0,0,1,40,32H176a32,32,0,0,1,32,32V168h8a8,8,0,0,1,4.8,1.6C222,170.46,232,178.39,232,192ZM96.26,173.48A8.07,8.07,0,0,1,104,168h88V64a16,16,0,0,0-16-16H67.69A31.71,31.71,0,0,1,72,64V192a16,16,0,0,0,32,0c0-5.74-4.83-9.62-4.88-9.66A7.82,7.82,0,0,1,96.26,173.48ZM216,192a12.58,12.58,0,0,0-3.23-8h-94a26.92,26.92,0,0,1,1.21,8,31.82,31.82,0,0,1-4.29,16H200A16,16,0,0,0,216,192Z"
						/></svg
					>
				</ActionListCard>
			{:else}
				<ActionListCard
					id={0}
					title={'Sign In or Register'}
					subtitle={'Join Play Engine'}
					cardLink={'/'}
					{isMobile}
				>
					<svg
						slot="leading-item"
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						fill="#ffffff"
						viewBox="0 0 256 256"
						><path
							d="M141.66,133.66l-40,40a8,8,0,0,1-11.32-11.32L116.69,136H24a8,8,0,0,1,0-16h92.69L90.34,93.66a8,8,0,0,1,11.32-11.32l40,40A8,8,0,0,1,141.66,133.66ZM200,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h64a8,8,0,0,0,8-8V40A8,8,0,0,0,200,32Z"
						/></svg
					>
				</ActionListCard>
			{/if}
		</div>

		<!-- Quick Play Card -->
		<div
			class="list-item color-2"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 1)}
		>
			<ActionListCard
				id={1}
				title={'Quick Play'}
				subtitle={'Play a random game'}
				cardLink={'/games/quick-play'}
				{isMobile}
			>
				<svg
					slot="leading-item"
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M128,44a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,44Zm0,168a72,72,0,1,1,72-72A72.08,72.08,0,0,1,128,212ZM164.49,99.51a12,12,0,0,1,0,17l-28,28a12,12,0,0,1-17-17l28-28A12,12,0,0,1,164.49,99.51ZM92,16A12,12,0,0,1,104,4h48a12,12,0,0,1,0,24H104A12,12,0,0,1,92,16Z"
					/></svg
				>
			</ActionListCard>
		</div>

		<!-- Trending -->
		<div
			class="list-item color-3"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 2)}
		>
			<ActionListCard
				id={2}
				title={'Trending'}
				subtitle={"See what's popular"}
				cardLink={'/games/trending'}
				{isMobile}
			>
				<svg
					slot="leading-item"
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M244,56v64a12,12,0,0,1-24,0V85l-75.51,75.52a12,12,0,0,1-17,0L96,129,32.49,192.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0L136,135l67-67H168a12,12,0,0,1,0-24h64A12,12,0,0,1,244,56Z"
					/></svg
				>
			</ActionListCard>
		</div>

		<!-- Top Played -->
		<div
			class="list-item color-4"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 3)}
		>
			<ActionListCard
				id={3}
				title={'Top Played'}
				subtitle={'All-time top played games'}
				cardLink={'/games/top-played'}
				{isMobile}
			>
				<svg
					slot="leading-item"
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M169.57,46.11a12,12,0,0,1,15.12-7.7L188,39.48V36a12,12,0,0,1,24,0v3.48l3.31-1.07a12,12,0,1,1,7.42,22.82l-3.31,1.08,2,2.82a12,12,0,1,1-19.41,14.1L200,76.42,198,79.23a12,12,0,1,1-19.41-14.1l2-2.82-3.31-1.08A12,12,0,0,1,169.57,46.11ZM236,128A108,108,0,1,1,128,20a109.19,109.19,0,0,1,18,1.49,12,12,0,0,1-4,23.67A85,85,0,0,0,128,44,83.94,83.94,0,0,0,62.05,179.94a83.48,83.48,0,0,1,29-23.42,52,52,0,1,1,74,0,83.48,83.48,0,0,1,29,23.42A83.57,83.57,0,0,0,212,128a85.2,85.2,0,0,0-1.16-14,12,12,0,0,1,23.67-4A109,109,0,0,1,236,128ZM128,148a28,28,0,1,0-28-28A28,28,0,0,0,128,148Zm0,64a83.53,83.53,0,0,0,48.43-15.43,60,60,0,0,0-96.86,0A83.53,83.53,0,0,0,128,212Z"
					/></svg
				>
			</ActionListCard>
		</div>

		<!-- Top Rated -->
		<div
			class="list-item color-5"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 4)}
		>
			<ActionListCard
				id={4}
				title={'Top Rated'}
				subtitle={'All-time highest rated games'}
				cardLink={'/games/top-rated'}
				{isMobile}
			>
				<svg
					slot="leading-item"
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M199,125.31l-49.89-18.38L130.69,57a19.92,19.92,0,0,0-37.38,0L74.93,106.93,25,125.31a19.92,19.92,0,0,0,0,37.38l49.89,18.38L93.31,231a19.92,19.92,0,0,0,37.38,0l18.38-49.89L199,162.69a19.92,19.92,0,0,0,0-37.38Zm-60,33.9a19.89,19.89,0,0,0-11.8,11.8L112,212.28,96.79,171A19.89,19.89,0,0,0,85,159.21h0L43.72,144,85,128.79A19.89,19.89,0,0,0,96.79,117L112,75.72,127.21,117a19.89,19.89,0,0,0,11.8,11.8L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z"
					/></svg
				>
			</ActionListCard>
		</div>

		<!-- Recently Added -->
		<div
			class="list-item color-6"
			on:mouseleave={(e) => handleHover(e, 6)}
			on:mouseover|preventDefault={(e) => handleHover(e, 5)}
		>
			<ActionListCard
				id={5}
				title={'Recently Added'}
				subtitle={'See the newest games'}
				cardLink={'/games/new'}
				{isMobile}
			>
				<svg
					slot="leading-item"
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M219.23,159.2a196.66,196.66,0,0,0-18-31.2,196.66,196.66,0,0,0,18-31.2c11.84-26.31,11.69-47.48-.43-59.6s-33.29-12.27-59.6-.43a196.66,196.66,0,0,0-31.2,18,196.66,196.66,0,0,0-31.2-18c-26.31-11.84-47.48-11.69-59.6.43s-12.27,33.29-.43,59.6a196.66,196.66,0,0,0,18,31.2,196.66,196.66,0,0,0-18,31.2c-11.84,26.31-11.69,47.48.43,59.6h0C43.33,224.93,51.78,228,62,228c10,0,21.77-2.92,34.76-8.77a196.66,196.66,0,0,0,31.2-18,196.66,196.66,0,0,0,31.2,18c13,5.85,24.74,8.77,34.76,8.77,10.26,0,18.71-3.07,24.84-9.2h0C230.92,206.68,231.07,185.51,219.23,159.2Zm-17.41-105c5.25,5.26,1.79,26-16,53.78-5.61-6.66-11.65-13.25-18.07-19.67S154.7,75.83,148,70.22C175.82,52.39,196.56,48.93,201.82,54.18ZM171.24,128a288.6,288.6,0,0,1-20.51,22.73A288.6,288.6,0,0,1,128,171.24a288.6,288.6,0,0,1-22.73-20.51A288.6,288.6,0,0,1,84.76,128,298.55,298.55,0,0,1,128,84.76a286.83,286.83,0,0,1,22.73,20.51A286.83,286.83,0,0,1,171.24,128ZM54.18,54.18c1.46-1.45,4.1-2.24,7.75-2.24,9.53,0,25.94,5.39,46,18.28-6.66,5.61-13.25,11.65-19.67,18.07S75.83,101.3,70.22,108C52.39,80.18,48.93,59.44,54.18,54.18Zm0,147.64c-5.25-5.26-1.79-26,16-53.78,5.61,6.66,11.65,13.25,18.07,19.67s13,12.46,19.67,18.07C80.18,203.61,59.44,207.07,54.18,201.82Zm147.64,0c-5.26,5.25-26,1.79-53.78-16,6.66-5.61,13.25-11.65,19.67-18.07s12.46-13,18.07-19.67C203.61,175.82,207.07,196.56,201.82,201.82ZM144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128Z"
					/></svg
				>
			</ActionListCard>
		</div>
	</div>
</div>

<style>
	.action-list-container {
		width: 100%;
		margin: 0 20px;
	}

	.action-list {
		display: grid;
		width: calc(100% - 20px);
		margin: 0 0 0 10px;
		gap: 10px;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, auto);
	}

	.list-item {
		padding: 10px;
		overflow: hidden;
		border-radius: 6px;
		background: var(--list-item-bg-default);
		transition: background 0.09s linear(0.07 -1.12%, 1 100%);
	}

	.list-item:hover {
		cursor: pointer;
		/* background-color: var(--list-item-hover) !important; */
	}

	.action-list :global(.playlist) {
		width: 100%;
	}
	.action-list :global(.card-info) {
		color: var(--color-primary);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 100%;
		border-radius: 6px;
		flex-grow: 1;
		width: 100%; /* Ensure this is explicitly set so that text truncation works */
	}

	.action-list :global(.card-info p) {
		white-space: nowrap; /* Changed from unset to nowrap */
		overflow: hidden; /* Hide overflowed text */
		text-overflow: ellipsis; /* Show an ellipsis for truncated text */
		width: 100%;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.78rem;
		font-weight: 450;
		color: var(--folder-button-color);
	}

	.action-list :global(.playlist) {
		max-width: 100%;
		background-color: unset;
		display: flex;
		flex-direction: row;
		width: calc(100% - 20px);
		height: 50px;
		border-radius: unset;
		margin: 0;
		padding: unset;
		transition: background 0.09s linear(0.07 -1.12%, 1 100%);
	}

	.action-list .list-item :global(.playlist):hover {
		cursor: pointer;
		background: unset !important;
	}

	.action-list :global(p.card-text) {
		white-space: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-block-end: 0;
		margin-block-start: 0;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		width: 100%;
		height: 1.1rem;
	}
	@media (max-width: 498px) {
		.action-list {
			grid-template-columns: repeat(2, 1fr); /* 2 columns */
			grid-template-rows: repeat(3, auto); /* 3 rows, height adjusted automatically */
		}
	}

	.list-item.color-1:hover {
		background-color: #523b3bb3 !important;
	}
	.list-item.color-2:hover {
		background-color: #4f3b52b3 !important;
	}
	.list-item.color-3:hover {
		background-color: #3b3e52b3 !important;
	}
	.list-item.color-4:hover {
		background-color: #3b5242b3 !important;
	}
	.list-item.color-5:hover {
		background-color: #524f3bb3 !important;
	}
	.list-item.color-6:hover {
		background-color: #52483bb3 !important;
	}
</style>
