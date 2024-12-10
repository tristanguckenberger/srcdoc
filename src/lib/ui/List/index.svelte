<script>
	// @ts-nocheck
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	let { gameId, listContent = [] } = $props();

	const shortenKeyTitle = (key) => {
		switch (key) {
			case 'days':
				return 'd';
			case 'hours':
				return 'h';
			case 'minutes':
				return 'm';
			case 'seconds':
				return 's';
			case 'milliseconds':
				return 'ms';
			default:
				return key;
		}
	};
</script>

<ol class="list">
	<ul class="list-labels">
		<li class="list-item-content">
			<h3>Player</h3>
		</li>
		<li class="list-item-content spacer"></li>
		<li class="list-item-content lean-right">
			<h3>Score</h3>
		</li>
		<li class="list-item-content lean-right">
			<h3>Time</h3>
		</li>
	</ul>

	{#each listContent as row, i (`${i}_${row.game_session_id}`)}
		<li class="list-item">
			<div class="list-item-content">
				<h3>
					{#if row?.profile_photo}
						<img src={row.profile_photo} class="avatar" alt={`${row.username}'s Avatar`} />
					{:else}
						<div class="avatar" alt={`${row.username}'s Avatar`}>
							<ImagePlaceHolder />
						</div>
					{/if}
					{i + 1}. @{row.username}
				</h3>
			</div>
			<div class="list-item-content spacer"></div>
			<div class="list-item-content lean-right">
				<span>{row.session_total_score}</span>
			</div>
			<div class="list-item-content lean-right time">
				{#each Object.keys(row.session_total_time) as key}
					<span class="time-val">{row.session_total_time[key]}{shortenKeyTitle(key)}</span>
				{/each}
			</div>
		</li>
	{/each}
</ol>
<hr class="divider" />

<style>
	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		color: var(--text-color-primary);
		display: grid;
		grid-template-columns: auto auto auto auto;
		grid-gap: 10px;
	}

	.list-labels {
		display: contents;
	}

	.list-item {
		display: contents;
	}

	.list-item img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}

	.list-item-content {
		display: flex;
		align-items: center;
		justify-content: left;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px 0 10px 0;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
		width: fit-content;
	}

	.list-item-content h3 {
		margin: 0;
		display: flex;
		gap: 10px;
	}

	.list-item-content span {
		margin: 0;
	}

	.list-item-content.spacer {
		width: 100%;
	}

	.avatar {
		border-radius: 50%;
		width: 23.5px !important;
		height: 23.5px !important;
		object-fit: cover;
		border: 2px solid #a69160;
		color: #e3f1f6;
		overflow: hidden;
	}
	.list-item-content.lean-right {
		position: relative;
		left: 30%;
		display: flex;
		gap: 7px;
	}
	.list-item-content.lean-right.time {
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
	}
	hr.divider {
		width: 80%;
		margin: 0;
		padding: 0;
		border: 0;
		height: 1px;
		background-color: var(--text-color-primary);
		position: absolute;
		top: 45px;
	}
	:global(.component-container) {
		overflow: auto !important;
	}
</style>
