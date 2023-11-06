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
							  
let sprite = getAsset('dude');
							  
let renderedSprite = PIXI.Sprite.from(sprite);
							  
app.stage.addChild(renderedSprite);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;

// Tell our application's ticker to run a new callback every frame, passing in the amount of time that has passed since the last tick
app.ticker.add((delta) => {
  // Add the time to our total elapsed time
  elapsed += delta;
  
  // Update the sprite's X position based on the cosine of our elapsed time.  We divide by 50 to slow the animation down a bit...
  renderedSprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
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
				name: 'images',
				type: 'folder',
				content: null,
				gameId: 1,
				parentFileId: 4,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 10,
				name: 'sprites',
				type: 'png',
				content: null,
				gameId: 1,
				parentFileId: 9,
				createdAt: '2023-10-08 00:30:43',
				updatedAt: '2023-10-08 00:30:43'
			},
			{
				id: 11,
				name: 'dude',
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
