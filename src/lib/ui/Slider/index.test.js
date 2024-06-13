// @ts-nocheck
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Slider from './index.svelte';
import { tick } from 'svelte';

// Mock emblaCarouselSvelte
vi.mock('embla-carousel-svelte', () => {
	return {
		__esModule: true,
		default: vi.fn(() => ({
			embla: vi.fn().mockReturnValue({
				on: vi.fn(),
				off: vi.fn(),
				scrollNext: vi.fn(),
				scrollPrev: vi.fn(),
				selectedScrollSnap: vi.fn().mockReturnValue(1),
				slidesInView: vi.fn().mockReturnValue([0, 1]),
				reInit: vi.fn()
			})
		}))
	};
});

describe('Slider.svelte', () => {
	it('should initialize the emblaCarouselSvelte instance correctly', async () => {
		const { container } = render(Slider, {
			props: {
				navActionHeight: 0,
				gamesAvailable: [],
				rawGamesData: [],
				currentIndex: 0,
				favoritesObj: {}
			}
		});

		console.log(container.innerHTML); // Log the rendered output
		await tick();

		// Check if emblaCarouselSvelte is initialized
		const emblaElement = container.querySelector('.embla');
		expect(emblaElement).not.toBeNull();
	});

	it('should display tooltips on action button hover', async () => {
		const { container } = render(Slider, {
			props: {
				navActionHeight: 0,
				gamesAvailable: [
					{
						id: 1,
						title: 'Game 1',
						description: 'A cool game',
						user_id: 1,
						thumbnail: ''
					}
				],
				rawGamesData: [],
				currentIndex: 0,
				favoritesObj: { count: 0, favorites: [] }
			}
		});

		const actionButton = container.querySelector('.action-button');
		await fireEvent.mouseOver(actionButton);

		const toolTip = container.querySelector('.tooltip');
		expect(toolTip).toBeVisible();
	});

	// Add more tests for other functionalities
});
