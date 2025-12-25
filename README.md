# Blog CMS System

A comprehensive blog management system built with Next.js 14, featuring a powerful CMS interface, SEO optimization, media management, and modern web technologies.

## Features

### Content Management
- **Rich Text Editor**: WYSIWYG editor with MDX support for creating engaging blog posts
- **Auto-save**: Prevents content loss during editing
- **Content Blocks**: Pre-built components for common blog elements
- **Real-time Preview**: Preview posts before publishing
- **Bulk Actions**: Delete, publish, archive multiple posts

### User Experience
- **Role-based Access**: Admin, Editor, and Author permission levels
- **Mobile Responsive**: Full mobile admin interface
- **Dark Mode**: Theme switching capability
- **Drag & Drop**: Easy image and media insertion
- **Quick Actions**: Duplicate posts, convert drafts to published

### Media Management
- **Vercel Blob Integration**: Scalable file storage solution
- **Image Optimization**: Automatic compression and WebP conversion
- **Media Library**: Browse, search, and manage uploaded files
- **Alt Text**: Required accessibility fields for images
- **Multiple Formats**: Support for images, videos, documents

### SEO Optimization
- **Meta Fields**: Title, description, keywords management
- **Open Graph**: Facebook/LinkedIn sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Schema Markup**: Structured data for rich snippets
- **URL Slugs**: SEO-friendly URL generation
- **Canonical URLs**: Duplicate content prevention
- **Focus Keywords**: Keyword density analysis
- **SEO Score**: Real-time SEO recommendations

### Blog Features
- **Categories**: Hierarchical category system
- **Tags**: Flexible tagging system
- **Author Profiles**: Multiple author support
- **Reading Time**: Automatic calculation
- **Related Posts**: AI-powered content suggestions
- **Comments**: Moderation system
- **Social Sharing**: Built-in sharing buttons

### Performance & Technical
- **Static Generation**: Pre-render blog posts for speed
- **CDN Integration**: Serve images via CDN
- **Caching**: Intelligent caching strategies
- **Search**: Full-text search functionality
- **RSS Feed**: Automatic RSS generation
- **Sitemap**: Dynamic XML sitemap generation

### Admin Interface
- **Dashboard**: Analytics, recent posts, quick stats
- **User Management**: Role-based permissions
- **Bulk Import**: Import from other platforms
- **Export**: Backup content in multiple formats
- **Revision History**: Track changes and revert if needed
- **Scheduled Posts**: Calendar view for content planning

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: Vercel Blob for media files
- **UI Components**: Radix UI + Tailwind CSS
- **Rich Text Editor**: TinyMCE
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Vercel Blob storage (via BLOB_READ_WRITE_TOKEN)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-cms-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_cms"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Blog: http://localhost:3000
   - CMS: http://localhost:3000/cms
   - Demo login: admin@example.com / password

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog frontend
│   └── cms/               # CMS interface
├── components/            # React components
│   ├── cms/              # CMS-specific components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## CMS Features

### Dashboard
- Overview of blog statistics
- Recent posts and performance metrics
- Quick actions for common tasks
- User activity and engagement data

### Post Management
- Create, edit, and delete blog posts
- Rich text editor with media support
- SEO optimization tools
- Scheduling and publishing controls
- Category and tag management

### Media Library
- Upload and organize media files
- Image optimization and resizing
- Alt text and metadata management
- Search and filter capabilities

### User Management
- Role-based access control
- User profiles and permissions
- Activity tracking and analytics

### SEO Tools
- Meta tag optimization
- Open Graph and Twitter Card setup
- Schema markup generation
- SEO score analysis
- Keyword density tracking

## API Endpoints

### Posts
- `GET /api/posts` - List posts with filtering
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Media
- `GET /api/media` - List media files
- `POST /api/media` - Upload media file
- `DELETE /api/media/[id]` - Delete media file

### Categories & Tags
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/tags` - List tags
- `POST /api/tags` - Create tag

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Docker
```bash
# Build the image
docker build -t blog-cms .

# Run the container
docker run -p 3000:3000 blog-cms
```

### Self-hosted
1. Build the production bundle
   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Advanced caching strategies
- [ ] Email newsletter integration
- [ ] Advanced user permissions
- [ ] Plugin system for extensions
- [ ] Mobile app for content management
- [ ] Advanced SEO tools
- [ ] Performance monitoring
- [ ] Automated backups