/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { BlogData, BlogPost, SuggestedArticle,FullCategories, Category } from '../types/blog';
import { Metadata } from 'next';




export const fetchBlogData = async (page: number = 1, limit: number = 6) => {
  const url = 'blogs';
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
        // You can include any authorization tokens here if needed
      },
    });
    return response.data; // Ensure this returns { data, meta }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchCategoryDetailsData = async (category: string): Promise<BlogPost[]> => {
  const url = `blogs?populate=*&filters[categories][Title][$eq]=${encodeURIComponent(category)}`;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You can include any authorization tokens here if needed
      },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Unable to fetch blog posts at this time. Please try again later.');
  }
};


export const fetchBlogDetailData = async (id: string): Promise<BlogData> => {
  const url = 'blogs';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${id}?populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You can include any authorization tokens here if needed
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
    throw new Error('Error fetching data');
  }
};

export const fetchSuggestedArticles = async (): Promise<SuggestedArticle[]> => {
   const SuggestedArticle_url =`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs?sort[0]=viewCount:desc&pagination[limit]=5&&populate=img`

  try {
    const response = await axios.get(SuggestedArticle_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You can include any authorization tokens here if needed
      },
    });
    console.log("Data fetched:", response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const viewCounter = async (id: string, count: number) => {
  // Increment the view counter
  const totalViewCounter = count + 1;

  try {
    // Make the PUT request to update the view counter
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}blogs/${id}`, 
      {
        data: { viewCount: totalViewCounter },  // Wrap viewCount inside "data"
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


export const fetchCategoriesWithSubcategories = async (id: string): Promise<{ data: FullCategories }> => {
  const url = "categories";
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${id}?populate[sub_categories][populate][0]=blogs`);
    console.log("response",response)
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
