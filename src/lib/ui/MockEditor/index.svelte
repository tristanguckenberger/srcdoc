<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { default as EditorInput } from '$lib/layout/EditorLayouts/Base/Input.svelte';
	import SplitPane from '$lib/layout/SplitPane/index.svelte';
	import Pane from '$lib/layout/EditorLayouts/Base/Pane.svelte';
	import Output from '$lib/ui/Output/Output.svelte';
	import buildDynamicSrcDoc from '$lib/srcdoc.js';
	import { getRootFileId } from '$lib/utils/getter.js';
	import {
		editorOutContainerWidth,
		editorOutContainerHeight,
		isVertical,
		sideBarState,
		appClientWidth
	} from '$lib/stores/layoutStore';
	import {
		editorElement,
		inputOutputContainerWidth,
		inputOutputContainerHeight,
		paneManager,
		clearSplit
	} from '$lib/stores/splitStore';
	import {
		fileSystemSidebarWidth,
		fileSystemSidebarOpen,
		fileStoreFiles,
		focusedFileId,
		fileSystemExpanderStore,
		fileSystemMetaDataStore,
		previouslyFocusedFileId,
		softSelectedFileId,
		openFiles,
		codePanes2,
		baseDataStore,
		focusedFolderId,
		openInNewPane
	} from '$lib/stores/filesStore.js';
	import { splitInstanceStore } from '$lib/stores/splitStore';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';

	// Expiremental
	import FileTree from '$lib/ui/FileSystem/FileTree.svelte';
	import TabContainer from '$lib/ui/FileSystem/TabContainer.svelte';
	import { gameControllerStore } from '$lib/stores/gameControllerStore.js';
	import { onDestroy, onMount, afterUpdate } from 'svelte';
	import { routeHistoryStore } from '$lib/stores/routeStore.js';
	import { gameSession } from '$lib/stores/gameSession/index.js';
	import { modalFullInfoStore, editorPageInfoStore } from '$lib/stores/InfoStore.js';
	import Documentation from '$lib/ui/Documentation/index.svelte';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';
	import { after } from 'lodash-es';

	const data = {
		files: [
			{
				id: 106,
				game_id: 51,
				parent_file_id: null,
				name: 'root',
				type: 'folder',
				content: null
			},
			{
				id: 108,
				game_id: 51,
				parent_file_id: 106,
				name: 'index',
				type: 'html',
				content:
					'<html>\n\t<head>\n\t</head>\n\t<body>\n\t\t<div id="gameMenu">\n\t\t\t<button id="startButton">Start Game</button>\n      <select name="modes" id="modeSelection">\n        <option value=0>Difficulty - Easy</option>\n        <option value=1>Difficulty - Medium</option>\n        <option value=2>Difficulty - Hard</option>\n      </select>\n\t\t</div>\n    <div class="gameBoardContainer">\n        <div id="gameBoard" />\n    </div>\n    </body>\n</html>'
			},
			{
				id: 109,
				game_id: 51,
				parent_file_id: 106,
				name: 'index',
				type: 'css',
				content:
					'body, html {\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.gameBoardContainer {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: 100vw;\n    height: 100vh;\n}\n\n#gameBoard {\n    display: grid;\n    background-color: rgb(46, 127, 208);\n    padding: 20px;\n    border-radius: 6px;\n    border: 4px solid rebeccapurple;\n    border-inline-color: red;\n    height: fit-content;\n}\n\n.snake {\n    background-color: rgb(149, 200, 149);\n}\n\n.food {\n    background-color: red;\n}\n\n#gameMenu {\n    position: absolute;\n    width: 100vw;\n    left: 0;\n    height: 100%;\n    display: flex;\n    z-index: 10;\n    justify-content: center;\n    align-items: center;\n    background-color: rgba(0, 0, 0, 0.5);\n    flex-direction: column-reverse;\n    gap: 40px;\n}\n\nselect, button {\n    border: none;\n    background-color: rgb(231, 227, 103);\n    height: 36.5px;\n    padding: 0 10px;\n    border-radius: 4px;\n    font-weight: 600;\n    font-family: monospace;\n}\n\nselect:hover, button:hover {\n    cursor: pointer;\n}\n'
			},
			{
				id: 107,
				game_id: 51,
				parent_file_id: 106,
				name: 'index',
				type: 'js',
				content:
					"const { width, height } = getClientDimensions();\nconst gameBoard = document.getElementById('gameBoard');\nconst boardSize = 20; // 20x20 grid\nconst gameMenu = document.getElementById('gameMenu');\nconst startButton = document.getElementById('startButton');\nconst modeSelection = document.getElementById('modeSelection');\nlet gameStarted = false;\nlet snake = [{ x: 8, y: 12 }]; // Initial snake position\nlet food = { x: 5, y: 5 }; // Initial food position\nlet direction = { x: 0, y: -1 }; // Initial direction: moving up\nlet lastMoveTime = Date.now();\nlet moveDelay = 120;\nlet score = 0;\nlet difficulty = {\n    easy: { interval: 50, moveDelay: 200 },\n    medium: { interval: 30, moveDelay: 120 },\n    hard: { interval: 30, moveDelay: 90 }\n};\nlet gameMode = [difficulty.easy, difficulty.medium, difficulty.hard];\nlet playerGameModeSelection = 1;\n\n// Get size of cell for responsive game board\nfunction getCellSize() {\n    const minSize = Math.min(window.innerWidth, window.innerHeight);\n    return Math.floor(minSize / (boardSize + 2)); // Adding padding and border\n}\n\n// Handle game score tracking\nasync function scoreChange(score) {\n    console.log(score);\n}\n\n// Handle game initialization\nfunction setupBoard() {\n    const cellSize = getCellSize();\n    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, ${cellSize}px)`;\n    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, ${cellSize}px)`;\n    gameBoard.innerHTML = '';\n    \n    for (let i = 0; i < boardSize * boardSize; i++) {\n        const cell = document.createElement('div');\n        cell.style.width = `${cellSize}px`;\n        cell.style.height = `${cellSize}px`;\n        gameBoard.appendChild(cell);\n    }\n\n    renderSnake();\n    renderFood();\n}\n\n// Handle Snake segment movement\nasync function updateSnakePosition() {\n    if (Date.now() - lastMoveTime < gameMode[playerGameModeSelection].moveDelay) {\n        return;\n    }\n    lastMoveTime = Date.now();\n\n    const head = {\n        x: (snake[0].x + direction.x + boardSize) % boardSize,\n        y: (snake[0].y + direction.y + boardSize) % boardSize,\n    };\n\n    snake.unshift(head);\n\n    if (head.x === food.x && head.y === food.y) {\n        placeFood();\n        renderFood();\n        console.log(\"length::\", snake?.length);\n        const snakeLength = snake?.length;\n        if (snakeLength !== score) {\n            score = snakeLength;\n            await scoreChange(score);\n        }\n    } else {\n        snake.pop();\n    }\n\n    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {\n        resetGame();\n    }\n\n    renderSnake();\n}\n\n// Handle snake segment visibility\nfunction renderSnake() {\n    const cells = gameBoard.children;\n    for (let i = 0; i < cells.length; i++) {\n        cells[i].classList.remove('snake');\n    }\n\n    snake.forEach((segment) => {\n        const index = segment.y * boardSize + segment.x;\n        if (index >= 0 && index < cells.length) {\n            cells[index].classList.add('snake');\n        }\n    });\n}\n\n// Handle food rendering\nfunction renderFood() {\n    const cells = gameBoard.children;\n    for (let i = 0; i < cells.length; i++) {\n        cells[i].classList.remove('food');\n    }\n\n    const index = food.y * boardSize + food.x;\n    if (index >= 0 && index < cells.length) {\n        cells[index].classList.add('food');\n    }\n}\n\n// Handle Game Over\nfunction resetGame() {\n    snake = [{ x: 8, y: 12 }];\n    direction = { x: 0, y: -1 };\n    placeFood();\n    setupBoard();\n    gameMenu.style.display = 'flex';\n    document.removeEventListener('keydown', handleKeydown);\n    playerGameModeSelection = 0;\n    modeSelection.value = 0;\n}\n\n// Handle initial and subsequent food placement/Movement\nfunction placeFood() {\n    let newFoodPosition;\n    do {\n        newFoodPosition = {\n            x: Math.floor(Math.random() * boardSize),\n            y: Math.floor(Math.random() * boardSize)\n        };\n    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));\n    food = newFoodPosition;\n}\n\n// Handle Arrow Key Movement\nfunction handleKeydown(e) {\n    e.preventDefault();\n    switch (e.key) {\n        case 'ArrowUp': direction = { x: 0, y: -1 }; break;\n        case 'ArrowDown': direction = { x: 0, y: 1 }; break;\n        case 'ArrowLeft': direction = { x: -1, y: 0 }; break;\n        case 'ArrowRight': direction = { x: 1, y: 0 }; break;\n    }\n}\n\n// Handle Start Game Event\ndocument.getElementById('startButton').addEventListener('click', function() {\n    gameMenu.style.display = 'none';\n    document.addEventListener('keydown', handleKeydown);\n    if (!gameStarted) {\n        gameStarted = true;\n    }\n    setInterval(updateSnakePosition, gameMode[playerGameModeSelection].interval);\n});\n\n// Handle Game Difficulty Change Event\nmodeSelection.addEventListener('change', (e) => {\n    playerGameModeSelection = e.target.value;\n    setInterval(updateSnakePosition, gameMode[playerGameModeSelection].interval);\n});\n\n// Handle Window Resize Event\nwindow.addEventListener('resize', setupBoard);\n\n// Initial Call to setup the game board\nsetupBoard();\n"
			}
		]
	};
	const play = false;
	let basicEditorLoaded;
	let initialized = false;

	$: if (data && basicEditorLoaded) {
		// this will be our data's starting point
		// We will need to update this data on every keystroke
		setTimeout(() => {
			baseDataStore.set(data);
			data.files.forEach((file) => {
				if (file.type === 'js' || file.type === 'css' || file.type === 'html') {
					loadFile(file);
					openInNewPane.set(true);
				}
			});
		}, 1000);
	}

	$: previousRoute = $routeHistoryStore[$routeHistoryStore.length - 2];

	const srcbuild = derived(
		[fileStoreFiles, editorOutContainerWidth, editorOutContainerHeight, gameControllerStore],
		([
			$fileStoreFiles,
			$editorOutContainerWidth,
			$editorOutContainerHeight,
			$gameControllerStore
		]) => {
			return buildDynamicSrcDoc(
				$fileStoreFiles,
				getRootFileId($fileStoreFiles),
				{
					width: $editorOutContainerWidth,
					height: $editorOutContainerHeight
				},
				$gameControllerStore
			);
		}
	);

	function loadFile(file) {
		if (!$openFiles?.some((openFile) => openFile.id === file.id) && file.type !== 'folder') {
			$openFiles = [...$openFiles, file];
		}

		splitInstanceStore.set(null);
		if ($softSelectedFileId === file.id) {
			softSelectedFileId.set(null);
		}

		previouslyFocusedFileId.set($focusedFileId);
		focusedFileId.set(file.id);
		focusedFolderId.set(null);
		clearSplit.set(true);
	}

	onMount(async () => {
		if ($appClientWidth && $appClientWidth < 498) {
			sideBarState.set(false);
		}

		// if (browser) {
		// 	await tick();
		// 	if (!$editorPageInfoStore?.viewed) {
		// 		$modalFullInfoStore = $editorPageInfoStore?.info;
		// 	}
		// }
	});

	afterUpdate(async () => {
		await tick();

		if (!initialized && $openFiles?.length > 0) {
			$codePanes2 = $openFiles?.map((file) => {
				return {
					paneID: `#split-${file.name}-${file.type}-${file.id}`,
					source: file.content,
					type: file.type,
					label: file.name
				};
			});
			initialized = true;
		}
	});

	onDestroy(() => {
		fileStoreFiles.set(null);
		focusedFileId.set(null);
		focusedFolderId.set(null);
		fileSystemExpanderStore.set({});
		fileSystemMetaDataStore.set({
			gameId: null,
			userId: null
		});
		previouslyFocusedFileId.set(null);
		softSelectedFileId.set(null);
		openFiles.set([]);
		fileSystemSidebarWidth.set(200);
		fileSystemSidebarOpen.set(true);
		codePanes2.set([]);
	});
</script>

<div class="main">
	<SplitPane
		panes={['#split-input-output']}
		sizes={[50, 50]}
		vertical={false}
		bind:this={$editorElement}
		splitParent={'split-main'}
	>
		<div
			bind:clientWidth={$inputOutputContainerWidth}
			bind:clientHeight={$inputOutputContainerHeight}
			id="split-input-output"
			bind:this={basicEditorLoaded}
		>
			<SplitPane
				panes={$openFiles?.length > 0 ? ['#split-2', '#split-3'] : ['#split-3']}
				sizes={$openFiles?.length > 0 ? [50, 50] : [100]}
				vertical={true}
				splitParent={'split-editor'}
				bind:this={$editorElement}
			>
				<!-- Editor Content -->
				{#if $openFiles?.length > 0}
					<EditorInput />
				{/if}

				<!-- Output Content -->
				<section
					id="split-3"
					class:withoutPanes={$paneManager?.length <= 4}
					bind:clientWidth={$editorOutContainerWidth}
					bind:clientHeight={$editorOutContainerHeight}
				>
					<Pane id={'split-output'} label={'output'}>
						<!-- {#if play} -->
						<Output slot="pane-content" srcdocBuilt={$srcbuild} {play} relaxed />
						<!-- {/if} -->
					</Pane>
				</section>
			</SplitPane>
		</div>
	</SplitPane>
</div>

<style>
	:global(body) {
		height: 100%;
		width: 100%;
		margin: 0;
	}
	.main {
		margin: 0 10px 10px 10px;
		max-height: unset;
		max-height: calc(100% - 106.5px);
		min-height: 70vh;
		height: 70vh;
		width: 80%;
	}
	:global(#split-output) {
		height: 100%;
		/* max-height: calc(100% - 101.5px); */
	}
	:global(.monaco-editor) {
		border-radius: 4px;
	}
	:global(.monaco-editor .overflow-guard) {
		border-radius: 6px !important;
	}
	:global(.margin-view-overlays) {
		background-color: transparent;
	}
	:global(.view-lines) {
		background-color: transparent;
	}
	:global(.section-panel) {
		flex-grow: 1;
	}
	#split-input-output {
		width: 100%;
		height: 100%;
		height: calc(100% - 4px);
		/* max-height: calc(100% - 101.5px); */
	}
	#split-3 {
		height: 100%;
		width: 100%;
	}

	#split-3.withoutPanes {
		height: 100% !important;
	}
	:global(#editor-layout.engineInRoute) {
		height: calc(100% - 56.5px);
		padding-top: 10px;
		max-height: calc(100% - 56.5px);
	}

	:global(#editor-layout.engineInRoute.showSideBar) {
		padding-top: 0px;
	}

	:global(main.editor) {
		height: calc(100% - 56.5px) !important;
	}
	.main :global(.split) {
		height: 500px;
	}
	.main :global(.split #split-input-output) {
		width: 100% !important;
	}
</style>
