"use client";
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import Submenu from '@/app/components/Submenu';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/Blogroute';

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
  img?: BlogPostImage; // img might be undefined
}

interface BlogPost {
  id: number;
  attributes: BlogPostAttributes;
}

// Fetch blog data from API
const fetchBlogData = async (search: string): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs?filters[Title][$contains]=${search}`);
    console.log("Response:", response.data);
    return response.data.data || []; // Ensure it returns an empty array if data is undefined
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Loading Card Component
const LoadingCard = () => (
  <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-700"></div>
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-2 bg-gray-700 h-8 w-3/4"></h2>
      <p className="text-gray-400 text-sm mb-4 bg-gray-700 h-4 w-1/3"></p>
      <p className="text-gray-300 mb-6 bg-gray-700 h-4 w-1/2"></p>
      <div className="bg-gray-700 h-6 w-1/3"></div>
    </div>
  </div>
);

export default function Article() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { search } = useParams<{ search: string }>();

  useEffect(() => {
    const getData = async () => {
      console.log("Fetching data...");
      try {
        const result = await fetchBlogData(search);
        console.log("Data fetched:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      }
    };
    getData();
  }, [search]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Submenu />
      <DynamicBanner />
      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.length > 0 ? (
            data.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
              >
                {post.attributes.img?.data?.attributes?.formats?.small?.url || post.attributes.img?.data?.attributes?.formats?.thumbnail?.url ? (
                  <img
                    src={post.attributes.img.data.attributes.formats.small?.url || post.attributes.img.data.attributes.formats.thumbnail.url}
                    alt={post.attributes.Title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-700"></div> // Fallback if no image
                )}
                <div className="p-6">
                  <h2 className="text-3xl font-semibold mb-2">{post.attributes.Title}</h2>
                  <p className="text-gray-400 text-sm mb-4">{post.attributes.Date}</p>
                  <p className="text-gray-300 mb-6">{post.attributes.updatedAt}</p>
                  <Link href={`/article/${post.id}/${post.attributes.slug}`} className="text-green-400 hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
