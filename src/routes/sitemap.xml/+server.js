// @ts-nocheck
export async function GET({ fetch, url }) {
	const response = await fetch('/api/games/sitemapData');
	const games = await response.json();
	const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			<url>
                <loc>https://playengine.xyz</loc>
            </url>
            <url>
                <loc>https://playengine.xyz/games</loc>
                <lastmod>2024-07-10</lastmod>
            </url>
            <url>
                <loc>https://playengine.xyz/games/top-played</loc>
                <lastmod>2024-07-10</lastmod>
            </url>
            <url>
                <loc>https://playengine.xyz/games/new</loc>
                <lastmod>2024-07-10</lastmod>
            </url>
            <url>
                <loc>https://playengine.xyz/games/top-rated</loc>
                <lastmod>2024-07-10</lastmod>
            </url>
            <url>
                <loc>https://playengine.xyz/games/trending</loc>
                <lastmod>2024-07-10</lastmod>
            </url>
        
      ${games
				.map((game) => {
					const formattedDate = game?.updated_at?.split('T')[0];
					return `
        <url>
          <loc>${url.origin}/games/${game.id}/play</loc>
          <lastmod>${formattedDate}</lastmod>
        </url>`;
				})
				.join('')}

      </urlset>`.trim();

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
