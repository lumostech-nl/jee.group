import { Metadata } from 'next'

export interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  canonicalUrl?: string
  noindex?: boolean
  nofollow?: boolean
}

/**
 * Generate meta tags for SEO optimization
 */
export function generateMetaTags(data: SEOData): Record<string, string> {
  const meta: Record<string, string> = {}

  // Basic meta tags
  if (data.title) {
    meta['title'] = data.title
    meta['og:title'] = data.title
    meta['twitter:title'] = data.title
  }

  if (data.description) {
    meta['description'] = data.description
    meta['og:description'] = data.description
    meta['twitter:description'] = data.description
  }

  if (data.keywords) {
    meta['keywords'] = data.keywords
  }

  if (data.image) {
    meta['og:image'] = data.image
    meta['twitter:image'] = data.image
    meta['twitter:card'] = 'summary_large_image'
  } else {
    meta['twitter:card'] = 'summary'
  }

  if (data.url) {
    meta['og:url'] = data.url
    meta['canonical'] = data.canonicalUrl || data.url
  }

  if (data.type) {
    meta['og:type'] = data.type
  }

  if (data.author) {
    meta['author'] = data.author
    meta['article:author'] = data.author
  }

  if (data.publishedTime) {
    meta['article:published_time'] = data.publishedTime
  }

  if (data.modifiedTime) {
    meta['article:modified_time'] = data.modifiedTime
    meta['og:updated_time'] = data.modifiedTime
  }

  if (data.section) {
    meta['article:section'] = data.section
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag, index) => {
      meta[`article:tag:${index + 1}`] = tag
    })
  }

  // Robots meta
  if (data.noindex || data.nofollow) {
    const robots = []
    if (data.noindex) robots.push('noindex')
    if (data.nofollow) robots.push('nofollow')
    meta['robots'] = robots.join(', ')
  }

  return meta
}

/**
 * Generate Next.js metadata for pages
 */
export function generateMetadata(data: SEOData): Metadata {
  const metaTags = generateMetaTags(data)

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    authors: data.author ? [{ name: data.author }] : undefined,
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.url,
      siteName: 'Jee Group',
      images: data.image ? [{ url: data.image }] : undefined,
      type: data.type || 'website',
      publishedTime: data.publishedTime,
      modifiedTime: data.modifiedTime,
      authors: data.author ? [data.author] : undefined,
      section: data.section,
      tags: data.tags,
    },
    twitter: {
      card: data.image ? 'summary_large_image' : 'summary',
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : undefined,
      creator: data.author,
    },
    alternates: {
      canonical: data.canonicalUrl || data.url,
    },
    robots: {
      index: !data.noindex,
      follow: !data.nofollow,
      googleBot: {
        index: !data.noindex,
        follow: !data.nofollow,
      },
    },
  }
}

/**
 * Generate structured data (JSON-LD) for articles
 */
export function generateArticleStructuredData(data: {
  title: string
  description: string
  image?: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author: string
  tags?: string[]
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    url: data.url,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime || data.publishedTime,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jee Group',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    keywords: data.tags?.join(', '),
  }

  return structuredData
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jee Group',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: 'Professional software development and IT consulting services',
    sameAs: [
      // Add social media URLs here
    ],
  }
}

/**
 * Generate structured data for website
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jee Group Blog',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: 'Professional insights on software development, technology, and business solutions',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate breadcrumbs structured data
 */
export function generateBreadcrumbsStructuredData(items: Array<{
  name: string
  url: string
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return structuredData
}

/**
 * Generate SEO score based on content analysis
 */
export function calculateSEOScore(data: {
  title?: string
  description?: string
  content?: string
  image?: string
  keywords?: string
}): number {
  let score = 0
  const maxScore = 100

  // Title optimization (20 points)
  if (data.title) {
    const titleLength = data.title.length
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20
    } else if (titleLength >= 20 && titleLength <= 70) {
      score += 15
    } else if (titleLength > 0) {
      score += 10
    }
  }

  // Description optimization (20 points)
  if (data.description) {
    const descLength = data.description.length
    if (descLength >= 120 && descLength <= 160) {
      score += 20
    } else if (descLength >= 100 && descLength <= 180) {
      score += 15
    } else if (descLength > 50) {
      score += 10
    }
  }

  // Content length (15 points)
  if (data.content) {
    const wordCount = data.content.split(/\s+/).length
    if (wordCount >= 1000) {
      score += 15
    } else if (wordCount >= 500) {
      score += 12
    } else if (wordCount >= 200) {
      score += 8
    } else if (wordCount > 0) {
      score += 5
    }
  }

  // Image presence (15 points)
  if (data.image) {
    score += 15
  }

  // Keywords usage (15 points)
  if (data.keywords && data.content) {
    const keywords = data.keywords.split(',').map(k => k.trim().toLowerCase())
    const content = data.content.toLowerCase()
    const keywordMatches = keywords.filter(keyword =>
      content.includes(keyword)
    ).length

    const keywordRatio = keywordMatches / keywords.length
    if (keywordRatio >= 0.8) {
      score += 15
    } else if (keywordRatio >= 0.6) {
      score += 12
    } else if (keywordRatio >= 0.4) {
      score += 8
    } else if (keywordRatio > 0) {
      score += 5
    }
  }

  // Headings structure (10 points)
  if (data.content) {
    const hasH1 = data.content.includes('<h1') || data.content.includes('# ')
    const hasH2 = data.content.includes('<h2') || data.content.includes('## ')
    const hasH3 = data.content.includes('<h3') || data.content.includes('### ')

    if (hasH1 && hasH2) {
      score += 10
    } else if (hasH1 || hasH2) {
      score += 7
    } else if (hasH3) {
      score += 5
    }
  }

  // Internal/external links (5 points)
  if (data.content) {
    const hasLinks = data.content.includes('<a href=') || data.content.includes('](')
    if (hasLinks) {
      score += 5
    }
  }

  return Math.min(score, maxScore)
}

/**
 * Get SEO recommendations based on content analysis
 */
export function getSEORecommendations(data: {
  title?: string
  description?: string
  content?: string
  image?: string
  keywords?: string
}): string[] {
  const recommendations: string[] = []

  if (!data.title) {
    recommendations.push('Add a compelling title (30-60 characters recommended)')
  } else {
    const titleLength = data.title.length
    if (titleLength < 30) {
      recommendations.push('Consider making your title longer (30-60 characters recommended)')
    } else if (titleLength > 60) {
      recommendations.push('Consider shortening your title (30-60 characters recommended)')
    }
  }

  if (!data.description) {
    recommendations.push('Add a meta description (120-160 characters recommended)')
  } else {
    const descLength = data.description.length
    if (descLength < 120) {
      recommendations.push('Consider making your description longer (120-160 characters recommended)')
    } else if (descLength > 160) {
      recommendations.push('Consider shortening your description (120-160 characters recommended)')
    }
  }

  if (!data.image) {
    recommendations.push('Add a featured image for better social media sharing')
  }

  if (!data.keywords) {
    recommendations.push('Add relevant keywords for better search engine optimization')
  }

  if (data.content) {
    const wordCount = data.content.split(/\s+/).length
    if (wordCount < 300) {
      recommendations.push('Consider adding more content (at least 300 words recommended)')
    }

    const hasH1 = data.content.includes('<h1') || data.content.includes('# ')
    const hasH2 = data.content.includes('<h2') || data.content.includes('## ')

    if (!hasH1) {
      recommendations.push('Add an H1 heading to your content')
    }

    if (!hasH2) {
      recommendations.push('Add H2 subheadings to structure your content')
    }
  }

  return recommendations
}
