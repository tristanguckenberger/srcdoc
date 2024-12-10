<script>
	import { getContext } from 'svelte';
	import { themeDataStore } from '$lib/stores/themeStore';

	const { tabs, currentTab } = getContext('settingsTabs');

	let themeString = $derived($themeDataStore?.theme?.join(' '));
</script>

<div class="tabComponentPickerContainer" style={themeString}>
	{#each tabs as tab, index}
		<div
			class="tabComponentPickerItem"
			class:active={tab?.name === tabs[$currentTab]?.name}
			onclick={() => ($currentTab = index)}
		>
			{tab.name}
		</div>
	{/each}
</div>
<hr class="divider" />

<style>
	.tabComponentPickerContainer {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 20px;
		width: calc(100% - 40px);
		padding: 0 20px;
		background-color: var(--color-secondary);
	}

	.tabComponentPickerItem {
		border-radius: 4px;
		cursor: pointer;
		color: var(--color-primary);
		font-family: 'Source Sans 3', sans-serif;
		font-weight: 600;
		padding: 10px;
	}

	.tabComponentPickerItem.active {
		/* background-color: var(--color-action); */
		color: var(--color-accent);
		/* text-decoration: underline; */
		background-color: var(--faded-highlight);
	}
	hr.divider {
		border: 0;
		height: 2px;
		background-color: var(--color-accent);
		width: calc(100% - 40px);
	}
</style>
