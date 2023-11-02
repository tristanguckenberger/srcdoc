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
		title: 'Phaser Game',
		description: 'An example phaser game project',
		userId: 1,
		libraries: [
			{
				name: 'phaser',
				type: 'js',
				url: `//cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js`
			}
		],
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
				content: '<div id="game-container"></div>',
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
				content: `
				var config = {
					type: Phaser.AUTO,
					width: 180,
					height: 320,
					scale: {
						scale: 'SHOW_ALL',
						orientation: 'LANDSCAPE'
					},
					resolution: window.devicePixelRatio,
					pixelArt: true,
					physics: {
						default: 'arcade',
						arcade: {
							debug: true,
							gravity: {
								y: 500
							}
						}
					},
					scene: [Intro, Level1]
				};
				
				var game = new Phaser.Game(config);
				function resize() {
					let canvas = document.querySelector('canvas');
					let width = window.innerWidth;
					let height = window.innerHeight;
					let wratio = width / height;
					let ratio = game.config.width / game.config.height;
					if (wratio < ratio) {
						canvas.style.width = width + 'px';
						canvas.style.height = width / ratio + 'px';
					} else {
						canvas.style.width = height * ratio + 'px';
						canvas.style.height = height + 'px';
					}
				}
				
				window.onload = () => {
					resize();
					window.addEventListener('resize', resize, false);
				};
				`,
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
			},
			{
				id: 11,
				name: 'Intro',
				type: 'js',
				content: `export default class Intro extends Phaser.Scene {
					constructor() {
						super({
							key: 'Intro'
						});
					}
					preload() {
						var progress = this.add.graphics();
						const self = this;
						this.load.on('progress', function(value) {
							progress.clear();
							progress.fillStyle(0x42f456, 1);
							progress.fillRect(0, 300, 800 * value, 20);
						});
				
						this.load.on('complete', function() {
							progress.destroy();
						});
					}
					create() {
				
						/*==============================================
						= Position GameObjects
						================================================
						*/
						this.bgbox = this.add
							.image(0, 0, 'bgbox')
							.setOrigin(0, 0)
							.setAlpha(0);
				
						this.title = this.add
							.image(this.game.config.width / 2, 110, 'title')
							.setAlpha(0);
				
						this.championships = this.add
							.image(this.game.config.width / 2, 200, 'championships')
							.setAlpha(0);
				
						this.tictactoe = this.add
							.image(this.game.config.width / 2, 220, 'tictactoe')
							.setAlpha(0);
				
						this.startbutton = this.add
							.image(this.game.config.width / 2, 270, 'startbutton')
							.setAlpha(0);
						/*==============================================
						= Animate GameObjects
						================================================
						*/
						this.bgboxTween = this.tweens.timeline({
							targets: this.bgbox,
							ease: 'Linear',
							loop: 0,
							tweens: [
								{
									alpha: 0.5,
									ease: 'Linear',
									duration: 2000,
									delay: 1000,
									repeat: 0
								}
							]
						});
						this.titleTween = this.tweens.timeline({
							targets: this.title,
							ease: 'Linear',
							loop: 0,
							tweens: [
								{
									y: 100,
									alpha: 1,
									ease: 'Linear',
									duration: 1000,
									delay: 0,
									repeat: 0
								},
								{
									y: 110,
									alpha: 1,
									ease: 'Linear',
									duration: 600,
									delay: 0,
									repeat: -1,
									yoyo: true
								}
							]
						});
						this.championshipTween = this.tweens.timeline({
							targets: this.championships,
							ease: 'Linear',
							loop: 0,
							tweens: [
								{
									y: 170,
									alpha: 1,
									ease: 'Linear',
									duration: 600,
									delay: 1000,
									repeat: 0
								}
							]
						});
						this.tictactoeTween = this.tweens.timeline({
							targets: this.tictactoe,
							ease: 'Linear',
							loop: 0,
							tweens: [
								{
									y: 200,
									alpha: 1,
									ease: 'Linear',
									duration: 600,
									delay: 1300,
									repeat: 0
								}
							]
						});
						this.startbuttonTween = this.tweens.timeline({
							targets: this.startbutton,
							ease: 'Linear',
							loop: 0,
							tweens: [
								{
									y: 240,
									alpha: 1,
									ease: 'Linear',
									duration: 500,
									delay: 1600,
									repeat: 0
								}
							]
						});
						/*==============================================
						= Actions
						================================================
						*/
						this.keys = this.input.keyboard.addKeys('ENTER,SPACE');
				
						this.startbutton.setInteractive().on('pointerdown', () => {
							this.intro_music.stop();
							this.scene.start('Level1');
						});
					}
					update(delta) {
						if (this.keys.SPACE.isDown || this.keys.ENTER.isDown) {
							this.scene.start('Level1');
						}
					}
				}
				`
			}
		],
		published: true,
		createdAt: '2021-01-01 12:00:00',
		updatedAt: '2021-01-01 12:00:00'
	}
];
