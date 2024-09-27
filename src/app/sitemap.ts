

import { MetadataRoute } from 'next';
import { BASE_URL } from './types/contants';
import { Article } from './types/blog';

interface ArticlesResponse {
  data: Article[];
}

async function fetchPosts(): Promise<ArticlesResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}blogs?fields[0]=slug&fields[1]=publishedAt&populate[img][fields][0]=url`,
    {
      headers: {
        'Cache-Control': 'no-cache', // Ensure no caching
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
}

function isValidArticle(article: Article): boolean {
  return article && article.attributes && typeof article.attributes.slug === 'string';
}

// Main sitemap generation function
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiResponse = await fetchPosts();
  console.log('Fetched posts:', apiResponse); // Debug: log the fetched posts

  const posts = apiResponse.data;

  const baseUrl = BASE_URL || 'http://localhost:3000';

  // Generate entries for blog posts
  const postEntries: MetadataRoute.Sitemap = posts
    .filter(isValidArticle) // Ensure that only valid articles are processed
    .map(post => {
      const lastModified = post.attributes.publishedAt ? new Date(post.attributes.publishedAt) : new Date();
      return {
        url: `${baseUrl}/article/${post.attributes.slug}`,
        lastModified: lastModified.toISOString(),
        changeFrequency: 'daily',
        priority: 0.7,
      };
    });

  console.log('Generated post entries:', postEntries); // Debug: log the generated post entries

  // Static entries for main pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/article/[slug]`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Combine static and dynamic entries
  const sitemapEntries = [...staticEntries, ...postEntries];
  console.log('Full Sitemap Entries:', sitemapEntries); // Debug: log the combined sitemap entries

  return sitemapEntries;
}