// @ts-nocheck
export function swipe(node, callback) {
	let startX, endX;

	function handleStart(event) {
		startX = event.touches[0].clientX;
	}

	function handleEnd(event) {
		endX = event.touches[0].clientX;
		if (startX > endX) {
			callback('left');
		} else {
			callback('right');
		}
	}

	node.addEventListener('touchstart', handleStart);
	node.addEventListener('touchend', handleEnd);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleStart);
			node.removeEventListener('touchend', handleEnd);
		}
	};
}
