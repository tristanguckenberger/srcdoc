export const gameData = [
	{
		id: 1,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill("#ffffff"); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 2,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill("#121212"); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 3,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 4,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 5,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 6,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 7,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 8,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 9,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 10,
		title: 'Example PIXI Game',
		description: 'An example game project',
		userId: 1,
		files: [
			{
				id: 1,
				name: 'root',
				type: 'folder',
				gameId: 1,
				parentFileId: null,
				createdAt: '2021-01-01 12:00:00',
				updatedAt: '2021-01-01 12:00:00'
			},
			{
				id: 2,
				name: 'src',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 3,
				name: 'index',
				type: 'html',
				content: `<!doctype html>
<html>
	<head>
	</head>
	<body>
	</body>
</html>`,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 4,
				name: 'assets',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 1,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 5,
				name: 'scripts',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 6,
				name: 'main',
				type: 'js',
				content: `const { width, height } = getClientDimensions();

let app = new PIXI.Application({ width, height });
document.body.appendChild(app.view);
								
// load sprite textures
let sprite = getAsset('characterSpriteSheet');
let charTexture = PIXI.Texture.from(sprite);

// character down
let characterDownRectangle = new PIXI.Rectangle(0, 0, 32, 32);
let characterDownTexture = new PIXI.Texture(charTexture, characterDownRectangle);
let characterUpRectangle = new PIXI.Rectangle(0, 48, 32, 32);
let characterUpTexture = new PIXI.Texture(charTexture, characterUpRectangle);
let character = new PIXI.Sprite(characterUpTexture);

// You can now add the sprite to the stage
app.stage.addChild(character);		
// app.stage.addChild(itemTexture);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

const handleKeyPress = (keyState) => {
	if (keyState?.current?.releasedTime) return keyState;

	return;
};

var count = 0;
var keyVal = null;

let speed = 5;
let horizontalSpeed = 0.1;
let verticalSpeed = 0.1;
let direction = { x: 0, y: 0 };
let targetDirection = { x: 0, y: 0 };
let lerpFactor = 0.1;
let deceleration = 0.95;
let acceleration = 0.55;
let gravity = 0.5;

var stop = false;

let platformGraphics = new PIXI.Graphics();
platformGraphics.beginFill(0x8B4513); // Brown color for the platform, you can change the color
platformGraphics.drawRect(0, 0, width, height / 3); // x, y, width, height of the platform
platformGraphics.endFill();

// Generate a texture from the graphics object
let platformTexture = app.renderer.generateTexture(platformGraphics);
let platformSprite = new PIXI.Sprite(platformTexture);

// Set the x, y position of the platform
// platformSprite.x = 100; // X position on the screen
platformSprite.y = app.screen.height - 50; // Y position on the screen. This places it 100 pixels above the bottom of the screen.

app.stage.addChild(platformSprite);

function isColliding(rect1, rect2) {
	return rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y;
}

app.ticker.add((delta) => {
	if (stop === true) return;

	character.y += verticalSpeed * delta;

	const isOnPlatform = isColliding(character.getBounds(), platformSprite.getBounds());
	if (isOnPlatform && verticalSpeed > 0) {
		character.y = platformSprite.y - character.height;
	}

	verticalSpeed += gravity * delta;

	if (keyState.pressed && !keyState?.current?.releasedTime) {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';
		const keyCode = keyState?.current?.keyEvent?.code;

		// Reset direction
		direction.x = 0;
		direction.y = 0;

		// Adjust direction based on the key pressed
		switch (keyCode) {
			case 'ArrowUp':
				direction.y = -1;
				break;
			case 'ArrowDown':
				direction.y = 1;
				break;
			case 'ArrowLeft':
				direction.x = -1;
				break;
			case 'ArrowRight':
				direction.x = 1;
				break;
			// Handle other keys as necessary
		}

		// Calculate acceleration or long press effects
		if (keyState.current.releasedTime && keyState.current.pressedTime) {
			const holdTime = keyState.current.releasedTime - keyState.current.pressedTime;
			// Use holdTime to modify speed if needed for acceleration
		}
	

		// Add the time to our total elapsed time
		elapsed += delta;

		if (isOnPlatform && keyState?.current?.keyEvent?.code === 'ArrowUp') {
			verticalSpeed = -11;
		}

		if ((isVeritcal) && verticalSpeed >= 3) {
			verticalSpeed /= (acceleration);

			if (Math.abs(verticalSpeed) >= 3) {
				verticalSpeed = 3;
			}			
		}

		if ((isHorizontal) && horizontalSpeed <= 5) {
			horizontalSpeed /= (acceleration);

			if (Math.abs(horizontalSpeed) >= 5) {
				horizontalSpeed = 5;
			}			
		}

		baseHeight = height * .13;

		character.width = baseHeight;
		character.height = baseHeight;

		if (direction.y < 0) {
			// Switch to the texture showing the sprite looking left
			character.texture = characterUpTexture;
		} else if (direction.y > 0) {
			// Switch to the texture showing the sprite looking right
			character.texture = characterDownTexture;
		}
	} else {
		let isVeritcal = keyState?.current?.keyEvent?.code === 'ArrowUp';
		let isHorizontal = keyState?.current?.keyEvent?.code === 'ArrowLeft' || keyState?.current?.keyEvent?.code === 'ArrowRight';

		if (isHorizontal && horizontalSpeed >= 0) {
			horizontalSpeed *= deceleration;

			if (Math.abs(horizontalSpeed) <= 0) {
				horizontalSpeed = 0;
			}			
		}
	}

	// Now use the smoothed out direction to update the character's position
	character.x += direction.x * horizontalSpeed * delta;
});`,
				gameId: 1,
				parentFileId: 5,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 7,
				name: 'styles',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 2,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 8,
				name: 'main',
				type: 'css',
				content: `html {
width: 100%;
	height: 100%;
}
								  
body { 
	width: 100%; 
	height: 100%;
	margin: 0;
	overflow: hidden;
}`,
				gameId: 1,
				parentFileId: 7,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 9,
				name: 'characterSpriteSheet',
				type: 'png',
				content:
					'data:image/png;base64,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',
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	}
];
