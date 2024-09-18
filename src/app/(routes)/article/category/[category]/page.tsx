/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/blog/Blogroute';
import Submenu from '@/app/components/layout/Submenu';
import SkeletonCard from '@/app/components/blog/SkeletonCard';


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
      try {
        const result = await fetchCategoryDetailsData(category);
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <Submenu />
      <DynamicBanner />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-green-400">&lt;</span>
          {category} Articles
          <span className="text-green-400">/&gt;</span>
        </h1>

        {error ? (
          <div className="bg-red-800 text-white p-4 rounded-md text-center">
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : data.length > 0
              ? data.map((post) => (
                  <article
                    key={post.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-gray-700">
                      {post.attributes.img?.data?.attributes?.formats ? (
                        <img
                          src={
                            post.attributes.img.data.attributes.formats.small?.url ||
                            post.attributes.img.data.attributes.formats.thumbnail?.url ||
                            '/default-image-url.jpg'
                          }
                          alt={post.attributes.Title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-4xl text-gray-500">
                          &#123; &#125;
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-green-400">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        {post.attributes.Title}
                      </h2>
                      <div className="text-sm text-gray-400 mb-4 font-mono">
                        <p>Created: {new Date(post.attributes.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(post.attributes.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/article/${post.id}/${post.attributes.slug}`}
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
                      >
                        $ cat article.md
                      </Link>
                    </div>
                  </article>
                ))
              : (
                <div className="col-span-full text-center text-gray-400 py-8">
                  <p className="text-2xl mb-4">No posts found in ~/articles/{category}</p>
                  <p className="text-lg">Try updating your search parameters or check back later.</p>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}