function generateClassFromJSON(config: ClassTemplate): string {
	const { className, baseClass, properties, methods } = config;

	// build the props
	const propertyCode = Object.entries(properties)
		.map(([key, value]) => {
			const defaultValue = typeof value === 'string' ? `'${value}'` : value;
			return `this.${key} = props.${key} || ${defaultValue};`;
		})
		.join('\n\t\t');

	// build methods
	const methodCode = Object.entries(methods)
		.map(([methodName, method]) => {
			const {
				params = [],
				body,
				static: isStatic = false,
				getter = false,
				setter = false
			} = method;

			// build getter
			if (getter) {
				return `
    get ${methodName}() {
      ${body}
    }
        `;
			}

			// build setter
			if (setter) {
				const paramList = params.join(', '); // Usually one parameter, e.g., ["value"]
				return `
    set ${methodName}(${paramList}) {
      ${body}
    }
        `;
			}

			// drop params into method signature
			const paramList = params.join(', ');
			// build static or reg methods
			return `
		  ${isStatic ? 'static ' : ''}${methodName}(${paramList}) {
			${body}
		  }
			  `;
		})
		.join('\n');

	// Return the full class template
	return `
	class ${className} extends ${baseClass} {
	  constructor(props) {
		super({ ...props });
		${propertyCode}
	  }
	  ${methodCode}
	}
	`;
}

function validateTemplate(template: ClassTemplate): boolean {
	if (!template.className) throw new Error('`className` is required.');
	if (!template.baseClass) throw new Error('`baseClass` is required.');

	Object.entries(template.methods).forEach(([methodName, method]) => {
		if (!method.params || !Array.isArray(method.params))
			throw new Error(`Method ${methodName} must have a 'params' array.`);
		if (!method.body || typeof method.body !== 'string')
			throw new Error(`Method ${methodName} must have a 'body' string.`);
	});

	return true;
}
