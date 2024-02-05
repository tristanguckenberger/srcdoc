/**
 * Preloads items around a given index within a specified range.
 *
 * @param {Function} preloadFunc The function to call for preloading each item.
 * @param {[]} items Array of items available for preloading.
 * @param {number} currentIndex The current index around which items should be preloaded.
 * @param {number} preloadBefore Number of items to preload before the current index.
 * @param {number} preloadAfter Number of items to preload after the current index.
 */
export function preloadItemsInRange(preloadFunc, items, currentIndex, preloadBefore, preloadAfter) {
	for (let offset = -preloadBefore; offset <= preloadAfter; offset++) {
		if (offset !== 0) {
			// Optional: Skip current index if not needed.
			const index = currentIndex + offset;
			if (index >= 0 && index < items.length) {
				// Ensure index is within bounds.
				preloadFunc(items[index]);
			}
		}
	}
}
