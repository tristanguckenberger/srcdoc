interface MethodTemplate {
	params: string[];
	body: string;
	static?: boolean;
	getter?: boolean;
	setter?: boolean;
}

interface ClassTemplate {
	className: string;
	baseClass: string;
	properties: Record<string, any>;
	methods: Record<string, MethodTemplate>;
}
