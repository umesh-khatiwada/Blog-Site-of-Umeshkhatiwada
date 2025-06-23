/* eslint-disable @next/next/no-img-element */
"use client";
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/blog/Blogroute';
import { Article } from "@/app/types/blog";
import Footer from '@/app/components/layout/Footer';

// Fetch blog data from API
const fetchBlogData = async (search: string): Promise<Article[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs?filters[Title][$contains]=${search}&populate=*`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Articlee() {
  const [data, setData] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { search } = useParams<{ search: string }>();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchBlogData(search);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      }
    };
    getData();
  }, [search]);

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Error 404: Data Not Found</h2>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <DynamicBanner />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-green-400">&lt;</span>
          DevOps and Coding Articles
          <span className="text-green-400">/&gt;</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.length > 0 ? (
            data.map((post, index) => (
              <div
                key={post.id}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {post.img && post.img[index]?.url ? (
                  <img
                    src={post.img[index].url}
                    alt={post.Title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <span className="text-4xl">&#123; &#125;</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <h2 className="text-xl font-semibold text-green-400">{post.Title}</h2>
                  </div>
                  <p className="text-white-400 text-sm mb-4">Posted: {new Date(post.publishedAt).toLocaleDateString()}</p>
                  <p className="text-white-400 text-sm mb-6">Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                  <Link href={`/article/${post.slug}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300">
                    $ cat article.md
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center">
              <h2 className="text-3xl font-bold mb-4">No Articles Found</h2>
              <p className="text-xl">Try searching for a different term.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
