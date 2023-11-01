export const gameData = [
	{
		id: 1,
		title: 'Example Game',
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
				content: `<div id="main">
				<div class="title-container">
					<h1 class="title">
						play engine
					</h1>
				</div> 
			</div>`,
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
				content: `document.addEventListener('DOMContentLoaded', function() {
					let counter = 0;
					const titleElement = document.querySelector('.title');
					
					setInterval(() => {
						let newText = 'play engine';
						
						for (let i = 0; i < counter; i++) {
							newText += '.';
						}
						
						titleElement.textContent = newText;
						
						counter = (counter + 1) % 4; // Cycle counter between 0 and 3
					}, 500); // Update every 500 milliseconds
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
				
				body { background-color: rgba(0, 0, 255, 0.4); width: 100%; height: 100%;}
				
				#main {
					width: 100%;
					height: 100%;
					display: flex;
				}
				
				.title-container {
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				
				h1 {
					color: #fff;
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
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	},
	{
		id: 2,
		title: 'Example Game 2',
		description: 'A second example game project',
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
				content: '<div>Hello, World!</div>',
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
				content: "console.log('Hello, World!');",
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
				content: 'body { background-color: #fff; }',
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
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	}
];
