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
                <strong>HTML Setup: </strong> Start by creating a basic HTML structure with a <div> that will serve as the game board.
                <p>
                    <pre>
                        <code class="step-1-1">
    &lt;div id="gameBoard"&gt;&lt;/div&gt;
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>CSS Styling: </strong> Define the size of the game board and style the individual cells. Use grid layout to arrange the cells.
                <p>
                    <pre>
                        <code>
#gameBoard {
    display: grid;
    grid-template-columns: repeat(20, 20px); /* Creates a 20x20 grid */
    grid-template-rows: repeat(20, 20px);
    width: 400px;
    height: 400px;
    border: 2px solid black;
}
.snake {
    background-color: green;
}
.food {
    background-color: red;
}
                        </code>
                    </pre>
                </p>
            </li>
            <li>
                <strong>JavaScript Setup:</strong> Initialize the grid in JavaScript by creating a matrix representation of the grid cells.
                <p>
                    <pre>
                        <code>
const gameBoard = document.getElementById('gameBoard');
const boardSize = 20; // 20x20 grid
let snake = [{ x: 8, y: 12 }]; // Initial snake position
let food = { x: 5, y: 5 }; // Initial food position

function setupBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            gameBoard.appendChild(cell);
        }
    }
    renderSnake();
    renderFood();
}
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        <br>
        <h2>Step 2: Implement Snake Movement</h2>
        <hr>
        <ol>
            <li>
                <strong>Handling Arrow Keys:</strong> Add event listeners to capture keyboard inputs to control the snake's direction.
                <p>
                    <pre>
                        <code>
let direction = { x: 0, y: -1 }; // Initial direction: moving up
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': direction = { x: 1, y: 0 }; break;
    }
});
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        <br>
        <h2>Step 3: Game Logic for Growth and Collision</h2>
        <hr>
        <ol>
            <li>
                <strong>Update Snake Position:</strong> Create a function that updates the snake's position based on the direction, checks for food consumption, and handles collisions.
                <p>
                    <pre>
                        <code>
function updateSnakePosition() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop(); // Remove the last segment
    }

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }
}                    
                        </code>  
                    </pre>
                </p>
            </li>
        </ol>
        <br>
        <h2>Step 4: Rendering the Snake and Food</h2>
        <hr>
        <ol>
            <li>
                <strong>Rendering Functions:</strong> Add functions to draw the snake and food on the game board.
                <p>
                    <pre>
                        <code>
function renderSnake() {
    snake.forEach(segment => {
        const index = segment.y * boardSize + segment.x;
        gameBoard.children[index].classList.add('snake');
    });
}

function renderFood() {
    const index = food.y * boardSize + food.x;
    gameBoard.children[index].classList.add('food');
}    

function resetGame() {
    // Reset the snake's starting position
    snake = [{ x: 8, y: 12 }];
    direction = { x: 0, y: -1 }; // Moving up initially

    // Place a new piece of food
    placeFood();

    // Clear the grid of all snake and food classes
    setupBoard();
}

function placeFood() {
    let newFoodPosition;
    do {
        // Generate a random x and y position within the grid
        newFoodPosition = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

    food = newFoodPosition; // Update global food position
}
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        <br>
        <h2>Step 5: Starting the Game</h2>
        <hr>
        <ol>
            <li>
                <strong>Game Loop:</strong> Use setInterval to update the game state at regular intervals.
                <p>
                    <pre>
                        <code>
setupBoard();
setInterval(updateSnakePosition, 200); // Update every 200 milliseconds
                        </code>
                    </pre>
                </p>
            </li>
        </ol>
        `,
		htmlCode: [
			{
				location: 'step-1-1',
				code: `
            <div id="gameBoard"></div>  
        `
			}
		]
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
