/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Submenu from '@/app/components/Submenu';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/Blogroute';
import SkeletonCard from '@/app/components/SkeletonCard'; // Import the SkeletonCard component

// Define TypeScript interfaces for the blog data
export interface BlogPost {
  id: number;
  attributes: {
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    description: any[]; // Adjust type based on your actual description structure
    slug: string;
    img?: {
      data?: {
        attributes?: {
          formats?: {
            small?: { url: string };
            thumbnail?: { url: string };
          };
        };
      };
    };
    categories?: {
      data?: Array<{
        id: number;
        attributes: {
          Title: string;
        };
      }>;
    };
  };
}

// Function to fetch category details data
const fetchCategoryDetailsData = async (category: string): Promise<BlogPost[]> => {
  const url = `blogs?populate=*&filters[categories][Title][$eq]=${encodeURIComponent(category)}`;
  console.log("URL:", url);

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    console.log("Fetched data:", response.data);

    const blogPosts = response.data.data || [];
    console.log("Blog posts extracted:", blogPosts);

    return blogPosts;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Unable to fetch blog posts at this time. Please try again later.');
  }
};

export default function Article() {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setError("Category is not defined");
      setLoading(false);
      return;
    }

    const getData = async () => {
      console.log("Fetching data...");
      try {
        const result = await fetchCategoryDetailsData(category);
        console.log("Data fetched:", result);

        if (result.length === 0) {
          setError("No blog posts found for this category");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Submenu />
      <DynamicBanner />

      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              data.length > 0 ? (
                data.map((post) => (
                  <div
              key={post.id}
              className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              {post.attributes.img?.data?.attributes?.formats ? (
                <img
                  src={
                    post.attributes.img.data.attributes.formats.small?.url ||
                    post.attributes.img.data.attributes.formats.thumbnail?.url ||
                    '/default-image-url.jpg' // Provide a fallback image URL if needed
                  }
                  alt={post.attributes.Title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src="/default-image-url.jpg" // Provide a fallback image URL if needed
                  alt={post.attributes.Title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-3xl font-semibold mb-2">{post.attributes.Title}</h2>
                {post.attributes.createdAt && (
                  <p className="text-gray-400 text-sm mb-4">{new Date(post.attributes.createdAt).toLocaleDateString()}</p>
                )}
                <p className="text-gray-300 mb-6">{new Date(post.attributes.updatedAt).toLocaleDateString()}</p>
                <Link href={`/article/${post.id}/${post.attributes.slug}`} className="text-green-400 hover:underline">
                  Read more →
                </Link>
              </div>
            </div>

                ))
              ) : (
                <div className="text-center text-gray-400 py-8">No blog posts found for this category.</div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
