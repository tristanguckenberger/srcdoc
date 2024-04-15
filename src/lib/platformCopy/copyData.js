import PlayEngineCircleIcon from '$lib/assets/PlayEngineCircleIcon.svg';
import sideBarToggleClosed from '$lib/assets/sideBarToggleClosed.png';
import sideBarToggleOpened from '$lib/assets/sideBarToggleOpened.png';
import createNewGame from '$lib/assets/createNewGame.png';
import actionMenuDark from '$lib/assets/actionMenuDark.png';
import playPageCogIcon from '$lib/assets/playPageCogIcon.png';
import playPageEditorIcon from '$lib/assets/playPageEditorIcon.png';
import playPageLeaderboardIcon from '$lib/assets/playPageLeaderboardIcon.png';
import playPageCommentIcon from '$lib/assets/playPageCommentIcon.png';
import playPageFavoriteIcon from '$lib/assets/playPageFavoriteIcon.png';
import playPageAddToPlaylistIcon from '$lib/assets/playPageAddToPlaylistIcon.png';
import playPagePlayIcon from '$lib/assets/playPagePlayIcon.png';
import playPagePauseIcon from '$lib/assets/playPagePauseIcon.png';
import playPageSwipeIcon from '$lib/assets/playPageSwipeIcon.svg';
import playPageArrowKeyNavIcons from '$lib/assets/playPageArrowKeyNavIcons.jpg';
import playPageButtonNavIcons from '$lib/assets/playPageButtonNavIcons.png';

export const copyData = {
	// Sorted by page
	fullInfoCopy: {
		homePageInfo: {
			firstLanding: {
				store: 'homePageInfoStore',
				title: 'Welcome to Play Engine!',
				description:
					'Play Engine is a platform for building, sharing, currating, and playing video games. Create a game, add games to a personal or public playlist, and of course PLAY!',
				slides: [
					{
						title: 'Welcome to Play Engine!',
						images: [PlayEngineCircleIcon],
						description:
							'Play Engine is a platform for building, sharing, currating, and playing video games. Create a game, find and/or add new games to your own personal or public playlists, and of course PLAY!'
					},
					{
						title: 'The Sidebar',
						images: [sideBarToggleClosed, sideBarToggleOpened],
						description:
							'Use the sidebar to navigate around the platform. You can toggle the sidebar by clicking the sidebar icon in the top left corner.'
					},
					{
						title: 'The Action Menu',
						images: [actionMenuDark],
						imageLarge: true,
						description:
							'Use the action menu for quick access to things like your library (if you have an account), trending games, recent games, and more!'
					},
					{
						title: 'Create a new Game',
						images: [createNewGame],
						description:
							'Create a new game to play and/or publish it to share it with the Play Engine community. Select "New Project" in the sidebar to create a new game. You\'ll be taken to the new games page, from there you can edit it\'s details, add it to a playlist by selecting the (+) icon, or start building by selecting the (</>) icon.'
					}
					// {
					// 	title: 'Add Games to a personal or public Playlist',
					// 	description: 'Add games to the playlist for the game night.'
					// },
					// {
					// 	title: 'Invite Friends',
					// 	description: 'Invite friends to join the game night and play games.'
					// }
				]
			}
		},
		gamePageInfo: {
			store: 'gamePageInfoStore',
			slides: [
				{
					title: 'Welcome to the Game Page!',
					description:
						'From here you can view (or edit if you are the creator) the game details, open the game in the play engine editor to start or continue building, comment on the game, play the game, discover other games, and more!'
				},
				{
					title: 'Edit Game Details',
					images: [playPageCogIcon],
					description:
						'Edit the game details to update the game title, description, and more. Click the cog icon in the top right corner of the game page to edit the game details. This will only be available if you are the game creator.'
				},
				{
					title: 'Open in Editor',
					images: [playPageEditorIcon],
					description:
						'Open the game in the game editor to make changes to the game. Click the code (</>) icon on the game page to open the game in the game editor. This will only be available if you are the game creator.'
				},
				{
					title: 'Open Game Leaderboard',
					images: [playPageLeaderboardIcon],
					description:
						'View the game leaderboard to see how you rank against other players. Click the user+list icon on the game page to open a games leaderboard (assuming the creator has opted into using this feature).'
				},
				{
					title: 'Comment on a Game',
					images: [playPageCommentIcon],
					description:
						'Leave a comment on the game page to share your thoughts on the game. Click the comment icon on the game page to leave a comment.'
				},
				{
					title: 'Favorite A Game',
					images: [playPageFavoriteIcon],
					description:
						"Users with an account can click the heart icon on an individual game's page to favorite a game. This will add the game to your favorites list."
				},
				{
					title: 'Add Game to Playlist',
					images: [playPageAddToPlaylistIcon],
					description:
						'Add the game to a category or one of your playlists to help with platform curation and making it easier to find similar games. Click the plus icon on the game page to add the game to a playlist.'
				},
				{
					title: 'Play Game',
					images: [playPagePlayIcon],
					description: 'Click the play icon on the game page to play the game.'
				},
				{
					title: 'Pause Game',
					images: [playPagePauseIcon],
					description:
						'When the game is actively playing, click the pause icon on the game page to pause the game.'
				},
				{
					title: 'Swipe & Drag Navigation',
					images: [playPageSwipeIcon],
					description:
						'Swipe up or down on mobile, or drag up and down on desktop, to navigate to a new or previous game.'
				},
				{
					title: 'Arrow-Key Navigation',
					images: [playPageArrowKeyNavIcons],
					description: 'Use the up and down arrow keys to navigate to a new or previous game.'
				},
				{
					title: 'Button Navigation',
					images: [playPageButtonNavIcons],
					description:
						'Use the up and down navigation buttons to navigate to a new or previous game.'
				}
			]
		},
		editorPageInfo: {
			firstLanding: {
				store: 'editorPageInfoStore',
				title: 'Welcome to the Game Editor!',
				description:
					'The game editor is where you can create and edit your games. You can add levels, characters, and more to your game.',
				slides: [
					{
						title: 'Welcome to the Game Editor!',
						description:
							'The game editor is where you can create and edit your games. You can add levels, characters, and more to your game.'
					},
					{
						title: 'Action Bar',
						description:
							'Use the action bar to toggle the sidebar, toggle the file explorer, compile the game, and to save your code.'
					},
					{
						title: 'File Explorer',
						description:
							'Use the file explorer to navigate through the folders and files in your game. You can right click on a file or folder for actions within the file explorer.'
					},
					{
						title: 'Resizing Editor Panes',
						description: 'You can resize the editor panes by dragging the border between the panes.'
					},
					{
						title: 'Code Editor Panes',
						description:
							'Use the code editor panes to write the code for your game. You can also open up to 3 files side by side by right clicking files in the file explorer and selecting the "Open in New Pane" option.'
					},
					{
						title: 'Game Preview',
						description:
							'Use the game preview to see how your game looks and functions. You can play the game in the game preview.'
					},
					{
						title: 'Building a Game',
						description:
							'You can write code in JavaScript, HTML, and CSS. I reccomend starting with 3 primary files to start: index.html, index.css, and index.js. For those who are new to coding, I reccomend starting with the "Getting Started" guide.'
					},
					{
						title: 'PIXI.js Integration',
						description:
							'Play Engine optionally provides PIXI.js as a game engine. You can use PIXI.js to create games. You can use the PIXI.js documentation to learn more about PIXI.js. You can also use the PIXI.js examples to learn how to use PIXI.js to simplify your development process.'
					}
				],
				apiSlides: [
					{
						title: 'Play Engine API',
						description:
							'Play Engine provides an API for you to use in your games. You can toggle the API documentation panel for more information by clicking the Docs button in the editors top action bar.'
					},
					{
						title: 'getAsset()',
						description:
							"The getAsset() function is PIXI wrapper function that encapsulates PIXI's load  should be used to load image assets (into a PIXI.js game) that have been uploaded to the optional assets folder. ",
						documentation:
							'getAsset(path: string): Asset Name e.g. "playerSprite.png", but just pass the name: getAsset("playerSprite"), Note: path is relative to the assets folder, ensure you include the file extension.'
					},
					{
						title: 'updateScore()',
						description:
							'The updateScore() function is a Play Engine API function that should be used to update the score in a game if you desire to track user game scores within a leaderboard.',
						documentation:
							'updateScore(score: number;): Use this function to update the user score. Note: The score param is what will be added to the existing user score and IS NOT the new total score; Play Engine will handle this for you.'
					},
					{
						title: 'gameAction()',
						description:
							'The gameAction() function is a Play Engine API function that should be used to send game actions to the Play Engine server. For game analytics.',
						documentation:
							"gameAction(action: string;): Use this function for setting session activity, the action can be 'start-game', 'stop-game', 'resume-game', or 'pause-game', Note: start and stop actions can only be called once per game session."
					},
					{
						title: 'getClientDimensions()',
						description: 'Returns the width and height of the client window in an object.',
						documentation:
							'getClientDimensions(): { width: number, height: number }, Note: This is the size of the client window. You can use this to make your game responsive.'
					}
				]
			}
		},
		libraryPageInfo: {
			firstLanding: {
				store: 'libraryPageInfoStore',
				title: 'Welcome to Your Library!',
				description:
					"Your library is where you can view and manage your games, your favorited games, and all your playlists, including both public playlists you add to your library and ones you've created."
			},
			removingAPlaylist: {
				title: 'Removing a Playlist',
				description:
					"To remove a playlist from your library, click the \"...\" button on the playlist card. You will see a modal with options like 'Edit' and 'Remove from library'. Select 'Remove from library'. This will remove the playlist from your library, but it will not delete the playlist from the platform."
			}
		}
	},
	alertCopy: {
		auth: {
			login: {
				success: {
					title: 'Logged In',
					message: 'You have successfully logged in.',
					useTimeout: true
				},
				error: {
					title: 'Log In Error',
					message: 'There was an error logging in.',
					useTimeout: false
				}
			},
			logout: {
				success: {
					title: 'Logged Out',
					message: 'You have successfully logged out.',
					useTimeout: true
				},
				error: {
					title: 'Log Out Error',
					message: 'There was an error logging out.',
					useTimeout: false
				}
			},
			register: {
				success: {
					title: 'Registered',
					message: 'You have successfully registered.',
					useTimeout: true
				},
				error: {
					title: 'Registration Error',
					message: 'There was an error registering.',
					useTimeout: false
				}
			}
		},
		game: {
			create: {
				success: {
					title: 'Game Created',
					message: 'You have successfully created a game.',
					useTimeout: true
				},
				error: {
					title: 'Game Creation Error',
					message: 'There was an error creating the game.',
					useTimeout: false
				}
			},
			save: {
				success: {
					title: 'Game Saved',
					message: 'The game has been saved.',
					useTimeout: true
				},
				error: {
					title: 'Game Save Error',
					message: 'There was an error saving the game.',
					useTimeout: false
				}
			},
			updateDetails: {
				success: {
					title: 'Game Details Updated',
					message: 'The game details have been updated.',
					useTimeout: true
				},
				error: {
					title: 'Game Details Update Error',
					message: 'There was an error updating the game details.',
					useTimeout: false
				}
			},
			start: {
				success: {
					title: 'Game Started',
					message: 'You have successfully started a game.',
					useTimeout: true
				},
				error: {
					title: 'Game Start Error',
					message: 'There was an error starting a game.',
					useTimeout: false
				}
			},
			end: {
				success: {
					title: 'Game Ended',
					message: 'You have successfully ended a game.',
					useTimeout: true
				},
				error: {
					title: 'Game End Error',
					message: 'There was an error ending a game.',
					useTimeout: false
				}
			}
		},
		playlist: {
			create: {
				success: {
					title: 'Playlist Created',
					message: 'You have successfully created a playlist.',
					useTimeout: true
				},
				error: {
					title: 'Playlist Creation Error',
					message: 'There was an error creating the playlist.',
					useTimeout: false
				}
			},
			save: {
				success: {
					title: 'Playlist Saved',
					message: 'The playlist has been saved.',
					useTimeout: true
				},
				error: {
					title: 'Playlist Save Error',
					message: 'There was an error saving the playlist.',
					useTimeout: false
				}
			},
			updateDetails: {
				success: {
					title: 'Playlist Details Updated',
					message: "The playlist's details have been updated.",
					useTimeout: true
				},
				error: {
					title: 'Playlist Details Update Error',
					message: "There was an error updating the playlist's details.",
					useTimeout: false
				}
			}
		}
	}
};
