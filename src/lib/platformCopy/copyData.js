export const copyData = {
	// Sorted by page
	fullInfoCopy: {
		home: {
			firstLanding: {
				title: 'Welcome to Play Engine!',
				description:
					'Play Engine is a platform for building, sharing, currating, and playing video games. Create a game, add games to a personal or public playlist, and of course PLAY!',
				slides: [
					{
						title: 'The Sidebar',
						description:
							'Use the sidebar to navigate around the platform. You can toggle the sidebar by clicking the sidebar icon in the top left corner.'
					},
					{
						title: 'Search',
						description: 'Use the search bar to search for games, playlists, and users.'
					},
					{
						title: 'Create a new Game',
						description:
							'Create a new game to play and share with friends or with the Play Engine community.'
					},
					{
						title: 'Add Games to a personal or public Playlist',
						description: 'Add games to the playlist for the game night.'
					},
					{
						title: 'Invite Friends',
						description: 'Invite friends to join the game night and play games.'
					}
				]
			}
		},
		game: {
			navigationActionOptions: [
				{
					title: 'Mobile Swipe Navigation',
					description: 'Swipe up or down to navigate to a new or previous game.'
				},
				{
					title: 'Arrow-Key Navigation',
					description: 'Use the up and down arrow keys to navigate to a new or previous game.'
				},
				{
					title: 'Button Navigation',
					description:
						'Use the up and down navigation buttons to navigate to a new or previous game.'
				}
			],
			pageActions: {
				EditGameDetails: {
					title: 'Edit Game Details',
					description:
						'Edit the game details to update the game title, description, and more. Click the cog icon in the top right corner of the game page to edit the game details. This will only be available if you are the game creator.'
				},
				OpenInEditor: {
					title: 'Open in Editor',
					description:
						'Open the game in the game editor to make changes to the game. Click the code (</>) icon on the game page to open the game in the game editor. This will only be available if you are the game creator.'
				},
				OpenGameLeaderboard: {
					title: 'Open Game Leaderboard',
					description:
						'View the game leaderboard to see how you rank against other players. Click the user+list icon on the game page to open a games leaderboard (assuming the creator has opted into using this feature).'
				},
				AddGameToPlaylist: {
					title: 'Add Game to Playlist',
					description:
						'Add the game to a category or one of your playlists to help with platform curation and making it easier to find similar games. Click the plus icon on the game page to add the game to a playlist.'
				},
				PlayGame: {
					title: 'Play Game',
					description: 'Click the play icon on the game page to play the game.'
				},
				PauseGame: {
					title: 'Pause Game',
					description:
						'When the game is actively playing, click the pause icon on the game page to pause the game.'
				}
			}
		},
		editor: {
			firstLanding: {
				title: 'Welcome to the Game Editor!',
				description:
					'The game editor is where you can create and edit your games. You can add levels, characters, and more to your game.',
				layoutSlides: [
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
		myLibrary: {
			firstLanding: {
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
