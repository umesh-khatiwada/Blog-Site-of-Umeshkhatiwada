import { MetadataRoute } from 'next';
import { BASE_URL } from './types/contants';
import { Article } from './types/blog';

interface ArticlesResponse {
  data: Article[];
}

async function fetchPosts(): Promise<ArticlesResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?fields[0]=slug&fields[1]=publishedAt&populate[img][fields][0]=url`,
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
  } catch (error) {
    console.warn('Unable to fetch posts for sitemap, returning empty array:', error);
    // Return empty array when backend is unavailable during build
    return { data: [] };
  }
}

function isValidArticle(article: Article): boolean {
  if (!article || typeof article.slug !== 'string') {
    console.log('Invalid article structure:', JSON.stringify(article, null, 2));
    return false;
  }
  return true;
}

// Main sitemap generation function
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const apiResponse = await fetchPosts()
    const posts = apiResponse.data;
    const baseUrl = BASE_URL || 'http://localhost:3000';
    // Log each post before filtering
    posts.forEach((post, index) => {
      console.log(`Raw post #${index + 1}:`, JSON.stringify(post, null, 2));
    });

    // Generate entries for blog posts
    const postEntries: MetadataRoute.Sitemap = posts
      .filter(isValidArticle) // Ensure that only valid articles are processed
      .map(post => {
        const lastModified = post.publishedAt ? new Date(post.publishedAt) : new Date();
        return {
          url: `${baseUrl}/article/${post.slug}`,
          lastModified: lastModified.toISOString(),
          changeFrequency: 'daily',
          priority: 0.7,
        };
      });

    // Static entries for main pages
    const staticEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/article/`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];

    // Combine static and dynamic entries
    const sitemapEntries = [...staticEntries, ...postEntries];

    return sitemapEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}