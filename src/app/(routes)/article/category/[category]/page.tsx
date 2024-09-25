"use client";
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/blog/Blogroute';
import SkeletonCard from '@/app/components/blog/SkeletonCard';
import { Article } from "@/app/types/blog";
import Image from 'next/image'; // Import the Image component

// Define TypeScript interfaces for the blog data
const fetchCategoryDetailsData = async (category: string): Promise<Article[]> => {
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

export default function Articles() {
  const { category } = useParams<{ category: string }>();
  const [data, setData] = useState<Article[]>([]);
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
              ? data.map((post, index) => (
                  <article
                    key={post.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-gray-700">
                      {post.img[index]?.url ? (
                        <Image
                          src={post.img[index]?.url || '/default-image-url.jpg'}
                          alt={post.Title}
                          layout="fill"
                          objectFit="cover" 
                          className="w-full h-full"
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
                        {post.Title}
                      </h2>
                      <div className="text-sm text-gray-400 mb-4 font-mono">
                        <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/article/${post.documentId}/${post.slug}`}
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
