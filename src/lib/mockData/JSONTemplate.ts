export const playerConfig: ClassTemplate = {
	className: 'Player',
	baseClass: 'DynamicObject',
	properties: {
		jumpStrength: 15,
		gravity: 9.8,
		isJumping: false
	},
	methods: {
		jump: {
			params: [],
			body: `
        if (!this.isJumping) {
          this.velocity.y = -this.jumpStrength;
          this.isJumping = true;
        }
      `
		}
	}
};
