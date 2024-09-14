/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Mark this component as a Client Component

import { useParams } from 'next/navigation';
import Header from '../../../components/Header'; 
import Submenu from '@/app/components/Submenu';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Define TypeScript interfaces for the blog data
interface TextNode {
  type: 'text';
  text: string;
}

interface ParagraphNode {
  type: 'paragraph';
  children: TextNode[];
}

type DescriptionNode = ParagraphNode; // Extend this type if there are other types of nodes

interface ImageFormats {
  thumbnail: { url: string };
  medium: { url: string };
  small: { url: string };
  large: { url: string };
}

interface ImageAttributes {
  name: string;
  formats: ImageFormats;
  url: string;
  
}

interface BlogAttributes {
  Title: string;
  publishedAt: string;
  description?: DescriptionNode[];
  img?: {
    data: {
      attributes: ImageAttributes;
    };
  };
}

interface BlogData {
  data: {
    attributes: BlogAttributes;
  };
}

// Reusable function to fetch data using Axios
const fetchBlogDetailData = async (num: string | undefined): Promise<BlogData> => {
  const url = 'blogs';
  if (!num) throw new Error('No ID provided');
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${num}?populate=img`);
    if (response.status === 404) {
      throw new Error('Blog post not found');
    }
    console.log("API Response:", response.data); // Added logging
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Blog post not found');
    }
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function BlogPost() {
  const { id, slug } = useParams();
  const [data, setData] = useState<BlogData | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }
  
    const fetchData = async () => {
      try {
        if (typeof id === 'string') {
          console.log("Slug:", slug);
          const postData = await fetchBlogDetailData(id); 
          setData(postData); 
        } else {
          setError('Invalid ID');
        }
      } catch {
        setError('Error loading blog post');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [slug, id]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-white font-bold text-xl py-10">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center text-red-500 font-bold text-xl py-10">{error}</div>;
    }
  
    if (!data || !data.data || !data.data.attributes) {
      return <div className="text-center text-white font-bold text-xl py-10">Post not found</div>;
    }
  
    const { Title, publishedAt, description, img } = data.data.attributes;
    const imageUrl = img?.data?.attributes?.formats?.thumbnail?.url;

    return (
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-green-400">{Title}</h1>
        <p className="text-gray-400 text-sm mb-6">Published on {new Date(publishedAt).toLocaleDateString()}</p>
        {imageUrl && (
          <img src={imageUrl} alt={Title} className="mb-6 rounded-lg shadow-lg" />
        )}
        <div>
          {description && description.map((desc, index) => {
            if (desc.type === 'paragraph') {
              return (
                <p key={index} className="text-gray-300 leading-relaxed mb-8">
                  {desc.children.map((child, i) => (
                    <span key={i}>{child.text}</span>
                  ))}
                </p>
              );
            }
            // Handle other node types if needed
            return null;
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Submenu />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </div>
    </div>
  );
}
