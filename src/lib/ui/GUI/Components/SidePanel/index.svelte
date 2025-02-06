<script>
	// @ts-nocheck
	/**
	 * Left sidebar panel, expandable in width
	 * Displays Panels:
	 * - /Panels/Assets: imports & manages images, sprites, spritesheets,
	 * audio clips, etc.
	 * - /Panels/ObjectEditor: Users will essentially be able to create
	 * objects here, which will feed their input into our JSON
	 * template, and then create object classes on the fly.
	 * - /Panels/ObjectLogic: Custom methods, will eventually make a
	 * drag/drop builder for this, but gonna keep it blank for now.
	 * - /Panels/ProjectOptions: Controls all general options for a project
	 * - /Panels/ScreenEditor: Think of a screen as a level or
	 * game UI (like a main menu); Each Screen is essentially is own game with
	 * it's own game loop. Screen's will be able to pass data back and forth,
	 * which will be managed by svelte context.
	 * - /Panels/ScreenLogic: This is essentially a panel for individual
	 * screen(game)/level based logic.
	 * - /Panels/Screens: This will be an editable list of screens/levels
	 * for a game. Screens can be grouped together for ordered flow or
	 * organizational purposes, showing what is linked. Screens and their
	 * groups/connections and flow could look something like this:
	 * - Screens:
	 *   - Main Menu [UI] [1]
	 *   - Paused Menu Overlay [UI] [Whenever]
	 *   - Levels [LevelGroup] [2]
	 *     - Level 1 [LVL] [2.1]
	 *     - Level 2 [LVL] [2.2]
	 *     - Level 3 [LVL] [2.3]
	 *     - Level 4 [LVL] [2.4]
	 *   - End Credits [UI] [3 or Whenever]
	 *   - Game Over [UI] [2 && Whenever]
	 */
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';
	import PanelInfo from '$lib/ui/GUI/Components/PanelInfo/index.svelte';

	import {
		guiEditorSidebarOpen,
		guiEditorSidebarWidth,
		fileSystemSidebarOpen,
		docsOpen,
		areaHeight
	} from '$lib/stores/filesStore.js';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { getContext, onMount, setContext } from 'svelte';

	let { panelTitle = '', panelType = '', panelHeaderButtons, children } = $props();

	let guiContext = getContext('GUIContext');
	let showToolTip = $state(false);
	let previousRoute = $derived($routeHistoryStore[$routeHistoryStore.length - 2]);

	onMount(() => {
		console.log('GUIContext::', guiContext);
	});
</script>

<div
	class={{ sidebar: 'sidebar', hidden: !$fileSystemSidebarOpen, docsOpen: $docsOpen }}
	bind:clientWidth={$guiEditorSidebarWidth}
	bind:clientHeight={$areaHeight}
>
	<div class="header">
		<div class="panel-info">
			<div class="panel-header">
				<div class="panel-title">{panelTitle}</div>
				<div
					class="panel-type
					{panelType === 'info' ? 'info' : ''}
					{panelType === 'warning' ? 'warning' : ''}
					{panelType === 'error' ? 'error' : ''}
				"
				>
					{panelType}
				</div>
				<div class="panel-header-buttons">
					{@render panelHeaderButtons?.()}
				</div>
			</div>
			<div class="additional-panel-content">{@render children?.()}</div>
		</div>
	</div>

	<hr class="sidebar-divider" />
	{#if $docsOpen}
		<Documentation parentHeight={$areaHeight} />
	{/if}
</div>

<style>
	.sidebar {
		padding: 10px;
		/* border-radius: 6px; */
		overflow: hidden;
	}

	.sidebar.docsOpen {
		max-width: 50% !important;
	}

	@media (min-width: 498px) {
		:global(.engineInRoute) .sidebar {
			height: calc(100% + 16px);
			bottom: 40px;
		}
		:global(.engineInRoute.noOpenTabs) .sidebar {
			height: calc(100% - 24px);
			bottom: 0px;
		}
	}

	.sidebar.hidden {
		display: none;
	}
	button.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
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
	a.docs-button svg,
	button.docs-button svg {
		width: 23px;
		height: 23px;
		fill: var(--color-primary);
	}
	a.docs-button {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
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
		justify-content: center;
	}
	div.action-row {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
	}
	.icon-tooltip-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000000000000;
	}
	.action-row :global(.tooltip__container.bottom) {
		top: 51px !important;
		bottom: unset;
	}
	.sidebar.docsOpen {
		max-width: 50% !important;
	}
	.panel-info {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.panel-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		height: 40px;
	}

	.panel-title {
		font-size: 1.25rem;
		font-weight: 500;
	}

	.panel-type {
		font-size: 1rem;
		font-weight: 500;
		padding: 0 8px;
		border-radius: 4px;
	}

	.info {
		background-color: var(--color-info);
		color: var(--color-info-text);
	}

	.warning {
		background-color: var(--color-warning);
		color: var(--color-warning-text);
	}

	.error {
		background-color: var(--color-error);
		color: var(--color-error-text);
	}

	.panel-header-buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.additional-panel-content {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 16px;
	}
</style>
