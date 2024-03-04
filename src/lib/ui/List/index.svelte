<script>
	// @ts-nocheck
	export let gameId;
	/**
	 * list: Array of items to display in the list
	 * @type {Array}
	 * Row object structure:
	 * {
	 *     game_session_id: string,
	 *     userId: string,
	 *     username: string,
	 *     profile_photo: string,
	 *     score: string,
	 *     session_total_time: object:
	 *     {
	 *          hours: string,
	 *          minutes: string,
	 *          seconds: string
	 *     }
	 * }
	 *
	 */
	export let listContent = [];
</script>

<ol class="list">
	<ul class="list-labels">
		<li class="list-item-content">
			<h3>Player</h3>
		</li>
		<li class="list-item-content spacer" />
		<li class="list-item-content lean-right">
			<h3>Score</h3>
		</li>
		<li class="list-item-content lean-right">
			<h3>Time</h3>
		</li>
	</ul>

	{#each listContent as row, i (`${i}_${row.game_session_id}`)}
		<li class="list-item">
			<!-- {#if row.profile_photo}
				<img src={row.profile_photo} class="avatar" alt={`${row.username}'s Avatar`} />
			{/if} -->

			<div class="list-item-content">
				<h3>
					<img src={row.profile_photo} class="avatar" alt={`${row.username}'s Avatar`} />
					@{row.username}
				</h3>
			</div>
			<div class="list-item-content spacer" />
			<div class="list-item-content lean-right">
				<span>{row.session_total_score}</span>
			</div>
			<div class="list-item-content lean-right">
				<span>{row.session_total_time?.hours ?? '00'}:</span>
				<span>{row.session_total_time?.minutes ?? '00'}:</span>
				<span>{row.session_total_time?.seconds ?? '00'}</span>
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
		padding: 10px;
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
	}
	.list-item-content.lean-right {
		position: relative;
		left: 30%;
	}
	hr.divider {
		width: 80%;
		margin: 0;
		padding: 0;
		border: 0;
		height: 1px;
		background-color: var(--text-color-primary);
		position: absolute;
		top: 80px;
	}
</style>
