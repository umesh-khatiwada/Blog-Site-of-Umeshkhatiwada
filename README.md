# Umesh Khatiwada Blog Site

![Next.js](https://img.shields.io/badge/Next.js-14.2.8-black) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

A modern blog platform with a Medium-inspired design built using Next.js and Tailwind CSS. The blog features a clean, typography-focused reading experience with robust error handling and data auto-refresh capabilities.

## Features

- **Medium-inspired UI**: Clean, modern design focused on readability and typography
- **Auto-refresh**: Articles automatically refresh every hour with visual notification
- **Error handling**: Robust error handling for API failures with graceful fallbacks
- **Responsive design**: Fully responsive layout that works on all screen sizes
- **Image optimization**: Optimized images using Next.js Image component and sharp
- **Dark mode support**: Built-in dark mode styling for comfortable reading

## Prerequisites

- Node.js and npm (the supported Node version is not pinned in `package.json`; TODO).
- A running Strapi CMS backend that exposes a `/blogs` collection (see [API Integration](#api-integration)).

## Getting Started

Create a `.env.local` file (see [Configuration](#configuration)), then:

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design System

The blog uses a custom Medium-inspired design system with the following components:

### CSS Classes

- `.medium-bg` - Base background for pages
- `.medium-container` - Main content container
- `.medium-card` - Article card styling
- `.medium-article` - Article page layout
- `.medium-header` - Navigation header
- `.medium-footer` - Page footer
- `.medium-notification` - Notification component

### Typography

- `.medium-main-title` - Main page title
- `.medium-subtitle` - Subtitle text
- `.medium-article-title` - Article title
- `.medium-card-title` - Card title
- `.medium-card-description` - Card description text

## Component Structure

- **ArticleClient.tsx** - Main article list with auto-refresh logic
- **[slug]/ArticleClient.tsx** - Article detail page
- **Header.tsx** - Navigation header
- **Footer.tsx** - Page footer
- **Pagination.tsx** - Page navigation
- **DummyCard.tsx** - Loading skeleton for articles

## API Integration

The blog connects to a Strapi CMS backend with automatic hourly data refresh and robust error handling. Environment variables control the API endpoint and authentication.

## Configuration

Environment variables read by the code (`src/app/lib/api.ts`, `Footer.tsx`, `postComment.ts`). Do not commit real values.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | yes | Base URL of the Strapi API; requests go to `${NEXT_PUBLIC_API_BASE_URL}/blogs`, etc. |
| `NEXT_PUBLIC_STRAPI_KEY` | yes | Strapi API token sent as `Authorization: Bearer ...` for view counts and comments. Note that `NEXT_PUBLIC_` variables are embedded in the browser bundle, so use a token with minimal (read/comment-only) permissions. |
| `BASE_URL` | TODO | Present in the example environment file but not referenced in `src/` or `next.config.mjs`. |

Remote images are only allowed from the hosts listed under `images.remotePatterns` in [`next.config.mjs`](./next.config.mjs).

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/app/
├── (routes)/article/      # list, [slug] detail, category/[category], search/[search]
├── components/{blog,layout,ui}/
├── hooks/                 # zustand store, useBlogPosts
├── lib/api.ts             # Strapi API calls (axios)
├── types/  utils/  styles/
├── layout.tsx  page.tsx  robots.ts  sitemap.ts
context/ThemeContext.js
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Strapi CMS](https://strapi.io/documentation)

## License

Released under the [MIT License](./LICENSE).

## Author

Umesh Khatiwada, https://github.com/umesh-khatiwada
