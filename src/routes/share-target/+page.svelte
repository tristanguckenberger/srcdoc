<script context="module">
	// @ts-nocheck
	export async function load({ url, page }) {
		// Extract the shared URL from the query parameters
		const sharedUrl = url.searchParams.get('url');

		// Perform a redirect to the shared URL within your app
		if (sharedUrl) {
			return {
				status: 302,
				redirect: sharedUrl
			};
		}

		// Handle the case where no URL is provided
		return {
			status: 400,
			error: new Error('No URL provided for sharing')
		};
	}
</script>
