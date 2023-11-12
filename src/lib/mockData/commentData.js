export const commentData = [
	{
		id: 1,
		userId: 1,
		gameId: 1,
		parentCommentId: null,
		commentText: "Howdy, this is a rootin' tootin' comment!"
	},
	{
		id: 2,
		userId: 1,
		gameId: 1,
		parentCommentId: 1,
		commentText: "Howdy, Partner! This is a rootin' tootin' reply to your rootin' tootin' comment!"
	},
	{
		id: 3,
		userId: 1,
		gameId: 1,
		parentCommentId: 2,
		commentText: 'Comment 3 in the chain!'
	},
	{
		id: 4,
		userId: 1,
		gameId: 1,
		parentCommentId: 2,
		commentText: 'Also replying to the chain!'
	},
	{
		id: 5,
		userId: 1,
		gameId: 1,
		parentCommentId: null,
		commentText: 'New Comment Here!'
	}
];
