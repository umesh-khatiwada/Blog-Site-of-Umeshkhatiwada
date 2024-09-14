/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from 'next/link';
import Header from '../components/Header';
import Submenu from '../components/Submenu';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DynamicBanner from '../components/Blogroute';

// Define TypeScript interfaces for the blog data
interface ImageFormats {
  thumbnail: { url: string };
  medium?: { url: string };
  small?: { url: string };
  large?: { url: string };
}

interface BlogPostImage {
  data: {
    attributes: {
      formats: ImageFormats;
    };
  } | null;
}

interface BlogPostAttributes {
  Title: string;
  Date: string;
  updatedAt: string;
  slug: string;
  img: BlogPostImage;
}

interface BlogPost {
  id: number;
  attributes: BlogPostAttributes;
}

// Fetch blog data from API
const fetchBlogData = async (): Promise<BlogPost[]> => {
  const url = 'blogs';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}?populate=img`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Dummy card placeholder component
const DummyCard = () => (
  <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-700"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-600 mb-2"></div>
      <div className="h-4 bg-gray-500 mb-4"></div>
      <div className="h-4 bg-gray-500 mb-6"></div>
      <div className="h-4 bg-gray-600"></div>
    </div>
  </div>
);

export default function Article() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      console.log("Fetching data...");
      try {
        const result = await fetchBlogData();
        console.log("Data fetched:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      }
    };
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      {/* Dynamic Submenu */}
      <Submenu />
      <DynamicBanner/>

      {/* Blog Posts Section */}
      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <DummyCard key={index} />
            ))
          ) : (
            data.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
              >
                {post.attributes.img.data && (
                  <img
                    src={post.attributes.img.data.attributes.formats.small?.url || post.attributes.img.data.attributes.formats.thumbnail.url}
                    alt={post.attributes.Title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-3xl font-semibold mb-2">{post.attributes.Title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{post.attributes.Date}</p>
                  <p className="text-gray-300 mb-6">{post.attributes.updatedAt}</p>
                  {/* Use dynamic routing for the blog post */}
                  <Link href={`/article/${post.id}/${post.attributes.slug}`} className="text-green-400 hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
