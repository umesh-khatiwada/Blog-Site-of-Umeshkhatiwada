/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { Article, Category, SubCategory } from '../types/blog';
import { GetServerSideProps, Metadata } from 'next';

export const fetchBlogData = async (page: number = 1, limit: number = 6) => {
  const url = '/blogs';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      params: {
        populate: 'img',
        'pagination[page]': page,
        'pagination[pageSize]': limit
      },
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty data structure for build process when backend is unavailable
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
      return {
        data: [],
        meta: {
          pagination: {
            page: page,
            pageSize: limit,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
    
    throw error;
  }
};

export const fetchCategoryDetailsData = async (category: string): Promise<Article[]> => {
  const url = `/blogs?populate=*&filters[categories][Title][$eq]=${encodeURIComponent(category)}`;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Return empty array for build process when backend is unavailable
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
      return [];
    }
    
    throw new Error('Unable to fetch blog posts at this time. Please try again later.');
  }
};

// You can include any authorization tokens here if needed
export const fetchBlogDetailData = async (slug: string): Promise<Article> => {
  const url = '/blogs';
  console.log("slug",slug)
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}?filters[slug][$eq]=${slug}&populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

      },
    });
    if (response.status === 404) {
      throw new Error('Blog post not found');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Blog post not found');
    }
    
    // Handle connection refused errors during build
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNREFUSED') {
      // Return a fallback article structure for build process
      const fallbackArticle: Article = {
        attributes: {},
        data: [{
          id: 1,
          documentId: 'fallback-id',
          Title: 'Article Not Available',
          description: 'This article is currently unavailable.',
          description_2: '',
          slug: slug,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          locale: 'en',
          shortDescription: 'This article is currently unavailable.',
          img: [],
          comments: [],
          sub_category: null as unknown as SubCategory,
          categories: [{
            id: 1,
            documentId: 'fallback-category',
            Title: 'General',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            locale: 'en',
            sub_categories: [],
            blogs: []
          }],
          localizations: []
        }],
        id: 1,
        documentId: 'fallback-id',
        Title: 'Article Not Available',
        description: 'This article is currently unavailable.',
        description_2: '',
        slug: slug,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        locale: 'en',
        shortDescription: 'This article is currently unavailable.',
        img: [],
        comments: [],
        sub_category: null as unknown as SubCategory,
        categories: [{
          id: 1,
          documentId: 'fallback-category',
          Title: 'General',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          locale: 'en',
          sub_categories: [],
          blogs: []
        }],
        localizations: []
      };
      
      return fallbackArticle;
    }
    
    throw new Error('Error fetching data');
  }
};







export const viewCounter = async (id: string, count: number) => {
  const totalViewCounter = count + 1;

  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${id}`, 
      {
        data: { viewCount: totalViewCounter },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error updating view counter:', error);
  }
};



export const fetchCategoriesWithSubcategories = async (id: string): Promise<{ data: Category }> => {
  const url = "/categories";
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${id}?populate[sub_categories][populate][0]=blogs`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


// Fetch categories from API
export async function fetchCategories(): Promise<Category[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories?populate=*`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
