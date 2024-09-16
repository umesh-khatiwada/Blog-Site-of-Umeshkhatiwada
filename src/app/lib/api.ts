import axios from 'axios';
import { BlogData, BlogPost, SuggestedArticle } from '../types/blog';


export const fetchCategoryDetailsData = async (category: string): Promise<BlogPost[]> => {
  const url = `blogs?populate=*&filters[categories][Title][$eq]=${encodeURIComponent(category)}`;
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Unable to fetch blog posts at this time. Please try again later.');
  }
};


export const fetchBlogDetailData = async (id: string): Promise<BlogData> => {
  const url = 'blogs';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${id}?populate=*`);
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
  // In a real application, this would make an API call
  const imageurl = 'https://d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2023/07/13220529/Artificial-Intelligence-in-Indonesia-The-current-state-and-its-opportunities.jpeg';
  return [
    { id: 1, title: "5 Tips for Better Coding", excerpt: "Improve your coding skills with these tips...", imageUrl: imageurl },
    { id: 2, title: "The Future of AI", excerpt: "Explore the latest trends in artificial intelligence...", imageUrl: imageurl },
    { id: 3, title: "Web Design Trends 2024", excerpt: "Stay ahead with these cutting-edge web design trends...", imageUrl: imageurl },
  ];
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

