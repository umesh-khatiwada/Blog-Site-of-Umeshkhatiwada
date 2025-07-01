# Umesh Khatiwada Blog Site

A modern blog platform with a Medium-inspired design built using Next.js and Tailwind CSS. The blog features a clean, typography-focused reading experience with robust error handling and data auto-refresh capabilities.

## Features

- **Medium-inspired UI**: Clean, modern design focused on readability and typography
- **Auto-refresh**: Articles automatically refresh every hour with visual notification
- **Error handling**: Robust error handling for API failures with graceful fallbacks
- **Responsive design**: Fully responsive layout that works on all screen sizes
- **Image optimization**: Optimized images using Next.js Image component and sharp
- **Dark mode support**: Built-in dark mode styling for comfortable reading

## Getting Started

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

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Strapi CMS](https://strapi.io/documentation)
