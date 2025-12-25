import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jee.group'

    // Static pages
    const staticPages = [
      '',
      '/about',
      '/services',
      '/portfolio',
      '/blog',
      '/contact',
      '/careers',
      '/industries',
      '/testimonials',
      '/solutions',
    ]

    // Fetch published posts
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Fetch categories
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        slug: true,
        updatedAt: true
      }
    })

    // Generate sitemap XML
    const urlEntries: string[] = []

    // Add static pages
    staticPages.forEach((page) => {
      urlEntries.push(`
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`)
    })

    // Add blog posts
    posts.forEach((post) => {
      urlEntries.push(`
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <lastmod>${post.updatedAt.toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>`)
    })

    // Add categories
    categories.forEach((category) => {
      urlEntries.push(`
    <url>
      <loc>${baseUrl}/blog/category/${category.slug}</loc>
      <lastmod>${category.updatedAt.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.5</priority>
    </url>`)
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400', // Cache for 1 hour, CDN for 24 hours
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    )
  }
}
