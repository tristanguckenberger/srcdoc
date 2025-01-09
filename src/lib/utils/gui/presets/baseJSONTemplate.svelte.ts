const baseTemplate: ClassTemplate = {
	className: '', // Placeholder, must be provided by the user
	baseClass: 'DynamicObject', // Default base class
	properties: {}, // Empty properties to be filled by the user
	methods: {
		update: {
			params: ['deltaTime'], // Example default method
			body: `
          if (this.physicsEnabled) {
            this.velocity.y += this.gravity * deltaTime;
          }
        `
		}
	}
};

/**
 * Usage Example:
 * 
 * 
    const playerConfig: ClassTemplate = {
        className: "Player",
        baseClass: "DynamicObject",
        properties: {
            jumpStrength: 20,
            gravity: 9.8,
            isJumping: false
        },
        methods: {
            // static mehtod
            createPlayer: {
            static: true,
            params: ["props"],
            body: "return new Player(props);"
            },
            // getter
            jumpStrength: {
            getter: true,
            body: "return this.jumpStrength;"
            },
            // setter
            jumpStrength: {
            setter: true,
            params: ["value"],
            body: "this.jumpStrength = value;"
            },
            // regular method
            jump: {
            params: ["jumpStrength = this.jumpStrength"],
            body: `
                this.velocity.y = -jumpStrength;
                this.isJumping = true;
            `
            },
            // regular method w/ default param
            update: {
            params: ["deltaTime = 1"],
            body: `
                if (this.physicsEnabled) {
                this.velocity.y += this.gravity * deltaTime;
                }
            `
            }
        }
    };
 */
