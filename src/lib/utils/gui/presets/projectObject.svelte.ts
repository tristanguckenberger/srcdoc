class BaseScreenLVL {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	width: number;
	height: number;
	isRunning: boolean;
	lastFrameTime: number;

	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.isRunning = false;
		this.lastFrameTime = 0;

		this.setupEventListeners();
	}

	start() {
		this.isRunning = true;
		this.lastFrameTime = performance.now();
		this.loop();
	}

	stop() {
		this.isRunning = false;
	}

	private loop() {
		if (!this.isRunning) return;

		const currentTime = performance.now();
		const deltaTime = (currentTime - this.lastFrameTime) / 1000;
		this.lastFrameTime = currentTime;

		this.update(deltaTime);
		this.render();

		requestAnimationFrame(() => this.loop());
	}

	update(deltaTime: number) {}

	render() {
		this.context.clearRect(0, 0, this.width, this.height);
	}

	private setupEventListeners() {
		const handleResize = () => {
			const dpr = window.devicePixelRatio || 1;
			this.canvas.width = window.innerWidth * dpr;
			this.canvas.height = window.innerHeight * dpr;
			this.width = this.canvas.width;
			this.height = this.canvas.height;
		};

		window.removeEventListener('resize', handleResize);
		window.addEventListener('resize', handleResize);
	}

	destroy() {
		this.stop();
		window.removeEventListener('resize', () => {});
	}
}

export default BaseScreenLVL;
