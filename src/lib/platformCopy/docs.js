// @ts-nocheck
// // Home Page (/games)
// import PlayEngineCircleIcon from '$lib/assets/PlayEngineCircleIcon.svg';
// import sideBarToggleClosed from '$lib/assets/sideBarToggleClosed.png';
// import sideBarToggleOpened from '$lib/assets/sideBarToggleOpened.png';
// import createNewGame from '$lib/assets/createNewGame.png';
// import actionMenuDark from '$lib/assets/actionMenuDark.png';

// Play Page (/game/:id/play)
// import playPageHome from '$lib/assets/playPageHome.png';
// import playPageCogIcon from '$lib/assets/playPageCogIcon.png';
// import playPageEditorIcon from '$lib/assets/playPageEditorIcon.png';
// import playPageLeaderBoardIcon from '$lib/assets/playPageLeaderBoardIcon.png';
// import playPageCommentIcon from '$lib/assets/playPageCommentIcon.png';
// import playPageFavoriteIcon from '$lib/assets/playPageFavoriteIcon.png';
// import playPageAddToPlaylistIcon from '$lib/assets/playPageAddToPlaylistIcon.png';
// import playPagePlayIcon from '$lib/assets/playPagePlayIcon.png';
// import playPagePauseIcon from '$lib/assets/playPagePauseIcon.png';
// import playPageSwipeIcon from '$lib/assets/playPageSwipeIcon.svg';
// import playPageArrowKeyNavIcons from '$lib/assets/playPageArrowKeyNavIcons.jpg';
// import playPageButtonNavIcons from '$lib/assets/playPageButtonNavIcons.png';

// Editor Page (/game/:id/engine)
// import editorPage from '$lib/assets/editorPage.png';
// import editorPageActionBar from '$lib/assets/editorPageActionBar.png';
import editorPageFileExplorer from '$lib/assets/editorPageFileExplorer.png';
import editorPageFileExplorerActions from '$lib/assets/editorPageFileExplorerActions.png';
import editorPageResizablePanes from '$lib/assets/editorPageResizablePanes.png';
import editorPageCodePanes from '$lib/assets/editorPageCodePanes.png';
import editorPageGamePreview from '$lib/assets/editorPageGamePreview.png';
import pixilogo from '$lib/assets/pixilogo.svg';

export const docs = [
	{
		title: 'Editor Overview',
		content: `
        <h1>Editor Overview</h1>
        <p>
            Welcome to the editor documentation! Here you will find all the 
            information you need to get started with the editor. As well as 
            a reference to all the features and options available to you.
        </p>
        <hr>
        <br>
        <h2>File Explorer</h2>
        <p>
            Use the file explorer to navigate through the folders and files 
            in your game. You can right click on a file or folder for actions 
            within the file explorer.
        </p>
        <img src="${editorPageFileExplorer}" alt="Editor Page File Explorer">
        <br>
        <h3>File Explorer - Actions</h3>
        <p>
            Right click on a file or folder in the file explorer to see a list 
            of actions you can take on that file or folder. You can create new 
            files, new folders, delete files, and save individual files from 
            here.
        </p>
        <img src="${editorPageFileExplorerActions}" alt="Editor Page File Explorer Actions">
        <br>
        <hr>
        <br>
        <h2>Editor Panes</h2>
        <p>
            The editor panes are where you will write your code. The editor 
            panes are resizable, so you can adjust the size of each pane to 
            your liking.
        </p>
        <br>
        <h3>Editor Panes - Resizing Editor Panes</h3>
        <p>
            You can resize the editor panes by dragging the border between 
            the panes.
        </p>
        <img src="${editorPageResizablePanes}" alt="Editor Page Resizable Panes">
        <br>
        <h3>Editor Panes - Code Editor</h3>
        <p>
            Use the code editor panes to write the code for your game. You 
            can also open up to 3 files side by side by right clicking files 
            in the file explorer and selecting the "Open in New Pane" option. 
            You can write code in JavaScript, HTML, and CSS. I recommend 
            starting with 3 primary files: index.html, index.css, and 
            index.js.
        </p>
        <img src="${editorPageCodePanes}" alt="Editor Page Code Panes">
        <br>
        <h3>Editor Panes - Game Preview</h3>
        <p>
            Use the game preview to see how your game looks and functions. You 
            can play the game in the game preview.
        </p>
        <img src="${editorPageGamePreview}" alt="Editor Page Game Preview">
        `
	},
	{
		title: 'Building Your First Game',
		content: `
        <h2>Introduction</h2>
        <hr>
        <p>
            Creating your first game using HTML, CSS, and JavaScript is a rewarding 
            experience that offers a hands-on introduction to programming for the web. 
            With just a web browser and a text editor, you can harness these 
            fundamental technologies to bring your creative ideas to life. In this 
            tutorial, we'll guide you step-by-step through the process of building a 
            simple but timeless classic: Snake. 
        </p>
        <p>
            This game challenges players to navigate a growing snake around the screen 
            while collecting food and avoiding obstacles. Along the way, you'll learn 
            key programming concepts like handling keyboard inputs, updating the DOM, 
            and implementing a game loop. By the end, you'll not only have a fun game 
            to play but also a solid foundation in web development. Let's get started!
        </p>
        <br>
        <h2>Setup</h2>
        <hr>
        <p>
            To get started on building your first Snake game, you'll need to create 
            three essential files: index.html, index.js, and index.css. These files 
            work together to form the foundation of your game. 
        </p>
        <p>
            Your index.html file will act as the main structure of your application, 
            defining the web page and linking to your JavaScript and CSS files. The 
            index.js file will handle the game logic, managing how the snake moves and 
            interacts with its environment. Lastly, the index.css file will be 
            responsible for the visual styling, ensuring the game looks sleek and 
            functional.
        </p>
        <p>
            You don't need to reference your index.js or index.css files in your HTML 
            file because it's all automatically compiled as a single file.
        </p>
        <h3>
            Add The Project Files
        </h3>
        <p>
            With the file explorer open, if you've not added any files, you will see a 
            single folder titled, "root". Right click on this folder and select, 
            "New File", then add, "index.html". Repeat this for, "index.js", and 
            "index.css".
        </p>
        <p>
            Now that your development environment is ready, let's dive into creating 
            the structure and logic needed to bring this timeless classic to life!
        </p>
        <br>
        <h2>Creating The Game</h2>
        <hr>
        <span>
            Before we start coding, let's take note of the primary game concepts of 
            our snake game:
        </span>
        
        <div>
            <h3>
                Grid-Based Game Board
            </h3>
            <ul>
                <li>
                    The game board is a grid of squares, each square representing 
                    a cell.
                </li>
                <li>
                    The snake, food, and obstacles will be represented as separate 
                    elements within this grid.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Snake Movement
            </h3>
            <ul>
                <li>
                    The snake starts with a fixed length and will move continuously 
                    in the direction controlled by the arrow keys.
                </li>
                <li>
                    Players can change direction at each game tick, but the snake 
                    cannot move backward onto itself.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Growth and Food
            </h3>
            <ul>
                <li>
                    Food will spawn randomly on empty grid cells.
                </li>
                <li>
                    When the snake eats the food, it grows in length by one 
                    segment, and new food will appear elsewhere on the board.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Collision Detection
            </h3>
            <ul>
                <li>
                    The game ends if the snake's head collides with the walls 
                    of the game board or any part of its own body.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Score Calculation
            </h3>
            <ul>
                <li>
                    The player's score is displayed on the screen.
                </li>
                <li>
                    Every time the snake eats food, the player's score increases based on the game's scoring rules.
                </li>
                <li>
                    The score will reset to zero upon game over.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Game Loop and Speed Increase
            </h3>
            <ul>
                <li>
                    The game loop, controlled via JavaScript's setInterval or similar timing functions, updates the board and snake's position at each tick.
                </li>
                <li>
                    The snake's speed increases progressively to challenge the player's reflexes as the game continues.
                </li>
            </ul>
        </div>
        <div>
            <h3>
                Game Over and Restart Mechanism
            </h3>
            <ul>
                <li>
                    When the game ends due to collision, the player should have a clear way to start a new game, resetting the grid and their score.
                </li>
            </ul>
        </div>
        <br>
        <h2>Step 1: Setup the Game Board</h2>
        <hr>
        <ol>
            <li>
                <strong>HTML Setup:</strong> Start by creating a basic HTML structure with a &lt;div&gt; that will serve as the game board. We'll also add a start button and a dropdown menu to select the game difficulty.
                <p>
                    <pre>
                        <code class="step-1-1">
    &lt;html&gt;
	&lt;head&gt;
        &lt;/head&gt;
	&lt;body&gt;
            &lt;div id="gameMenu"&gt;
                &lt;button&gt; id="startButton"&gt;Start Game&gt;&lt;/button&gt;
                &lt;select name="modes" id="modeSelection"&gt;
                    &lt;option value=0&gt;Difficulty - Easy&gt;&lt;/option&gt;
                    &lt;option value=1&gt;Difficulty - Medium&gt;&lt;/option&gt;
                    &lt;option value=2&gt;Difficulty - Hard&gt;&lt;/option&gt;
                &lt;/select&gt;
            &lt;/div&gt;
            &lt;div class="gameBoardContainer"&gt;
                &lt;div id="gameBoard" /&gt;
            &lt;/div&gt;
        &lt;/body&gt;
    &lt;/html&gt;
                        </code>
                    </pre>
                    That's it for the HTML setup! We'll now use CSS to style the game.
                </p>
            </li>
            <li>
                <strong>CSS Styling: </strong> Define the size of the game board and style the individual cells. Use grid layout to arrange the cells.
                <p>
                    <pre>
                        <code>
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.gameBoardContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

#gameBoard {
    display: grid;
    background-color: rgb(46, 127, 208);
    padding: 20px;
    border-radius: 6px;
    border: 4px solid rebeccapurple;
    border-inline-color: red;
    height: fit-content;
}

.snake {
    background-color: rgb(149, 200, 149);
}

.food {
    background-color: red;
}

#gameMenu {
    position: absolute;
    width: 100vw;
    left: 0;
    height: 100%;
    display: flex;
    z-index: 10;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    flex-direction: column-reverse;
    gap: 40px;
}

select, button {
    border: none;
    background-color: rgb(231, 227, 103);
    height: 36.5px;
    padding: 0 10px;
    border-radius: 4px;
    font-weight: 600;
    font-family: monospace;
}

select:hover, button:hover {
    cursor: pointer;
}
 
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>JavaScript Setup: Initialize Game Variables</strong> First, in your index.js file, define the variables to maintain the state of the game. This includes the game board, buttons, snake's initial position, food's position, movement direction, and game settings.
                <p>
                    <pre>
                        <code>
//Get game elements from the DOM
const gameBoard = document.getElementById('gameBoard'); //Get the game board element
const gameMenu = document.getElementById('gameMenu'); //Get the game menu element
const startButton = document.getElementById('startButton'); //Get the start button element
const modeSelection = document.getElementById('modeSelection'); //Get the game difficulty selection dropdown element

//Initialize game variables 
const boardSize = 20; //20x20 grid
let gameStarted = false; //Game state
let snake = [{ x: 8, y: 12 }]; //Initial snake position
let food = { x: 5, y: 5 }; //Initial food position
let direction = { x: 0, y: -1 }; //Initial direction: moving up
let lastMoveTime = Date.now(); // Var to track last move time, defaults to Date.now()
let moveDelay = 120; // Var to track move delay, defaults to 120 milliseconds
let score = 0; // Var to track player score, defaults to 0

//Initialize game difficulty settings
let difficulty = {
    easy: { interval: 50, moveDelay: 200 },
    medium: { interval: 30, moveDelay: 120 },
    hard: { interval: 30, moveDelay: 90 }
};
//Game difficulty option refs
let gameMode = [difficulty.easy, difficulty.medium, difficulty.hard];
//Defaults game difficulty selection to Medium
let playerGameModeSelection = 1;
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        <br>
        <h2>Step 2: Game Logic Implementation</h2>
        <hr>
        <ol>
            <li>
                <strong>Calculate Cell Size for Responsive Design:</strong> The getCellSize function computes the size of each cell based on the smallest dimension of the window to ensure the game is responsive.
                <p>
                    <pre>
                        <code>
function getCellSize() {
    //ensure the game board fits within the window
    const minSize = Math.min(window.innerWidth, window.innerHeight);
    return Math.floor(minSize / (boardSize + 2)); // +2 for padding and border
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Set Up the Game Board:</strong> The setupBoard function initializes the game grid and renders the initial state of the snake and the food.
                <p>
                    <pre>
                        <code>
function setupBoard() {
    const cellSize = getCellSize();
    gameBoard.style.gridTemplateColumns = \`repeat(\${boardSize}, \${cellSize}px)\`;
    gameBoard.style.gridTemplateRows = \`repeat(\${boardSize}, \${cellSize}px)\`;
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.style.width = \`\${cellSize}px\`;
        cell.style.height = \`\${cellSize}px\`;
        gameBoard.appendChild(cell);
    }

    renderSnake();
    renderFood();
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Update Snake Position:</strong> The updateSnakePosition function moves the snake in the current direction, checks for collisions with food to grow the snake, and handles self-collisions to reset the game.
                <p>
                    <pre>
                        <code>
async function updateSnakePosition() {
    if (Date.now() - lastMoveTime < gameMode[playerGameModeSelection].moveDelay) {
        return;
    }
    lastMoveTime = Date.now();

    const head = {
        x: (snake[0].x + direction.x + boardSize) % boardSize,
        y: (snake[0].y + direction.y + boardSize) % boardSize,
    };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
        renderFood();
        console.log("length::", snake?.length);
        const snakeLength = snake?.length;
        if (snakeLength !== score) {
            score = snakeLength;
            await scoreChange(score);
        }
    } else {
        snake.pop();
    }

    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }

    renderSnake();
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Render Snake and Render & Place Food:</strong> The renderSnake and renderFood functions update the visual representation of the snake and food on the grid. The placeFood function handles the relocation of food after the user has collected food.
                <p>
                    <pre>
                        <code>
function renderSnake() {
    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('snake');
    }

    snake.forEach((segment) => {
        const index = segment.y * boardSize + segment.x;
        if (index >= 0 && index < cells.length) {
            cells[index].classList.add('snake');
        }
    });
}

function renderFood() {
    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('food');
    }

    const index = food.y * boardSize + food.x;
    if (index >= 0 && index < cells.length) {
        cells[index].classList.add('food');
    }
}

function placeFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    food = newFoodPosition;
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Reset Game:</strong> The resetGame function reinitializes the game after a collision.
                <p>
                    <pre>
                        <code>
function resetGame() {
    snake = [{ x: 8, y: 12 }];
    direction = { x: 0, y: -1 };
    placeFood();
    setupBoard();
    gameMenu.style.display = 'flex';
    document.removeEventListener('keydown', handleKeydown);
    playerGameModeSelection = 0;
    modeSelection.value = 0;
    gameAction('stop-game');
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Handle Snake Movement:</strong> The handleKeydown function changes the snake's direction based on arrow key presses. 
                <p>
                    <pre>
                        <code>
function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp': direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': direction = { x: 1, y: 0 }; break;
    }
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Add Game Start, Difficulty Selection, and Window Resize Event Listeners:</strong> The startButton click event listener starts the game and sets the update interval. The modeSelection event listener updates the game mode based on user selection, and the resize event ensures the game board adapts to window size changes.
                <p>
                    <pre>
                        <code>
startButton.addEventListener('click', function() {
    gameMenu.style.display = 'none';
    document.addEventListener('keydown', handleKeydown);
    if (!gameStarted) {
        gameStarted = true;
    }
    setInterval(updateSnakePosition, gameMode[playerGameModeSelection].interval);
});

// Handle Game Difficulty Change Event
modeSelection.addEventListener('change', (e) => {
    playerGameModeSelection = e.target.value;
    setInterval(updateSnakePosition, gameMode[playerGameModeSelection].interval);
});

// Handle Window Resize Event
window.addEventListener('resize', setupBoard);
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>Initialization Call:</strong> Finally, call the setupBoard function to initialize the game board.
                <p>
                    <pre>
                        <code>
// Initial Call to setup the game board
setupBoard();
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        `
	},
	{
		title: 'Advanced Concepts',
		content: `
        <h2>PIXI.js</h2>
        <p>
            Play Engine optionally provides PIXI.js as a game engine. PIXI.js is
            a 2D rendering engine that simplifies the process of creating games
            in the browser. PIXI.js uses WebGL to render graphics, but can also
            fall back to HTML5 Canvas if WebGL is not available. You can use 
            PIXI.js to create games. You can use the PIXI.js documentation to 
            learn more about PIXI.js. You can also use the PIXI.js examples to 
            learn how to use PIXI.js to simplify your development process.
        </p>
        <img src="${pixilogo}" alt="PIXI.js Logo">
        `
	},
	{
		title: 'API Reference',
		content: `
            <h2>getAsset()</h2>
            <p>
                The getAsset() function is PIXI wrapper function that 
                encapsulates PIXI's load  should be used to load image 
                assets (into a PIXI.js game) that have been uploaded to the 
                optional assets folder.
            </p>
            <p>
                getAsset(path: string): Asset Name e.g. "playerSprite.png", but just pass the name: getAsset("playerSprite"), Note: path is relative to the assets folder, ensure you include the file extension.

                <pre>
                    <code>
... Init code here ... 

// Get the PIXI loader
const Loader = PIXI.Assets;

// use getAsset to load a png image asset such as a sprite sheet
let sprite = getAsset('characterSpriteSheet.png');

... Other code here ... 

try {
    // We can now load the sprite sheet, saving it as a variable, 'texture'
    const texture = await Loader.load(sprite);
    if (!texture) {
        console.log('sprite not found...');
    }

    // Create a rectangle for the sprite sheet to use when the character is facing down
    let characterDownRectangle = new PIXI.Rectangle(0, 48, 32, 32);

    // Create a texture for the sprite sheet to use when the character is facing down, based on the rectangle
    let characterDownTexture = new PIXI.Texture(texture, characterDownRectangle);
    
    // Set the texture frame to the rectangle
    texture.frame = characterDownRectangle;


    // Create a rectangle for the sprite sheet to use when the character is facing up
    let characterUpRectangle = new PIXI.Rectangle(0, 0, 32, 32);
    
    // Create a texture for the sprite sheet to use when the character is facing up, based on the rectangle
    let characterUpTexture = new PIXI.Texture(texture, characterUpRectangle);


    // Set our character sprite to the characterUpTexture as a default
    let character = new PIXI.Sprite(characterUpTexture);
    

    // Set the character sprite's width and height
    const baseHeight = height * .13;
    character.width = baseHeight;
    character.height = baseHeight;

    
    // You can now add the sprite to the PIXI game stage
    app.stage.addChild(character);

... Remaining code here ...

                    </code>
                </pre>
            </p>
            <br>
            <h2>updateScore()</h2>
            <p>
                The updateScore() function is a Play Engine API function that should be used to update the score in a game if you want to track user game scores within a leaderboard.
            
                updateScore(score: number;): Use this function to update the user score. Note: The score param is what will be added to the existing user score and IS NOT the new total score; Play Engine will handle this for you.

                <pre>
                    <code>
                        
                    </code>
                </pre>
            </p>
            <br>
            <h2>gameAction()</h2>
            <p>
                The gameAction() function is a Play Engine API function that should be used to send game actions to the Play Engine server. For game analytics.
            </p>
            <p>
                gameAction(action: string;): Use this function for setting session activity, the action can be 'start-game', 'stop-game', 'resume-game', or 'pause-game', Note: start and stop actions can only be called once per game session.
                <pre>
                    <code>
document.getElementById('startButton').addEventListener('click', function() {
    // Trigger the start-game action when the start button is clicked
    gameAction('start-game');
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('ship').style.display = 'block';
    
    // Variable to track if the game has started
    if (!gameStarted) {
        gameStarted = true;
    }

    // Start the game loop
    setTimeout(function() {
        ...
                    </code>
                </pre>
            </p>
            <br>
            <h2>getClientDimensions()</h2>
            <p>
                Returns the width and height of the client window in an object.
            
                getClientDimensions(): { width: number, height: number }, Note: This is the size of the client window. You can use this to make your game responsive.
                <pre>
                    <code>
                        
                    </code>
                </pre>
            </p>
        `
	},
	{
		title: 'Common Issues & Troubleshooting',
		content: `
            <h2>Save Frequently/Often</h2>
            <p>
                The editor does not save automatically. It is important to save 
                your work frequently to avoid losing any changes.
            </p>
            <br>
            <h2>Why is my content not saving?</h2>
            <p>
                Have you tried turning it off and on agian? Kidding... 
                If you run into this issue, copy the contents of the file 
                just to be safe, then close the tab that needs to be saved. 
                Refresh the page (do not hard refresh), and then try to reopen 
                the file and attempt to save the file contents again.
            </p>
            <br>
            <h3>Still having issues?</h3>
            <p>
                If you are still having issues, ensure you still have your file 
                contents copied to your clipboard, then close the tab and hard 
                refresh (Ctrl + Shift + R). Reopen the file and highlight the 
                whole thing, then replace what's there with your copied file 
                content. You should be able to save now.
            </p>
        `
	}
];
