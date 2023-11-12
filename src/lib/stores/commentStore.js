// @ts-nocheck
import { writable } from 'svelte/store';

export const commentSystemExpanderStore = writable({});
export const commentStoreComments = writable(null);

export function editComment(targetId, newCommentText, comments) {
	const updatedComments = comments.map((comment) => {
		if (comment.id === targetId) {
			return {
				...comment,
				commentText: newCommentText
			};
		}

		return comment;
	});

	commentStoreComments.set(updatedComments);
}
