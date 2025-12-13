import { generateSitemap } from '@/actions/seo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sitemap = await generateSitemap();

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (_error) {
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
