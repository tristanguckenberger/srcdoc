export function hover(node) {
    // setup work goes here...
    const handleHover = (event) => {
		if (node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("hovered"));
		}
	};

	document.addEventListener("mouseover", handleHover, true);

	

	return {
		destroy() {
			// ...cleanup goes here
            document.removeEventListener("mouseover", handleHover, true);
		}
	};
}