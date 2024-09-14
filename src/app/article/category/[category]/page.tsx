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

// Define TypeScript interface for category response
interface CategoryResponse {
  data: {
    attributes: {
      blogs: {
        data: BlogPost[];
      };
    };
  }[];
}

// Fetch blog data from API
const fetchCategoryDetailsData = async (category: string): Promise<BlogPost[]> => {
  const url = `categories?filters[Title][$eq]=${encodeURIComponent(category)}&populate[blogs]=*`;
  console.log("URL:", url);
  try {
    const response = await axios.get<CategoryResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    const blogPosts = response.data.data.flatMap(item => item.attributes.blogs.data);
    console.log("Fetched blog posts:", blogPosts);
    return blogPosts;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Article() {
  const { category } = useParams<{ category: string }>(); // Ensure TypeScript knows `category` is a string
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

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
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };
    getData();
  }, [category]);

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
          {loading ? (
            // Show skeleton cards while loading
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
                  {post.attributes.img?.data && (
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
            ) : (
              <div>No blog posts found</div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
