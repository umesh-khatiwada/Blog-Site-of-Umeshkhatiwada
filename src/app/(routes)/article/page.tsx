// src/app/Article.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import { useEffect, useState } from 'react';
import Header from '@/app/components/layout/Header';
import DynamicBanner from '@/app/components/blog/Blogroute';
import Submenu from '@/app/components/layout/Submenu';
import { BlogPost } from '@/app/types/blog';
import { fetchBlogData } from '@/app/lib/api';
import Pagination from '@/app/components/blog/Pagination';


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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPageData = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchBlogData(page);
      setData(result.data);
      // Assuming the API returns meta.pagination.total and you have a fixed limit
      const totalPages = Math.ceil(result.meta.pagination.total / 6); // Adjust limit if needed
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Submenu />
      <DynamicBanner />

      {/* Blog Posts Section */}
      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <DummyCard key={index} />
            ))
          ) : (
            data.length === 0 ? (
              <div>No posts found</div>
            ) : (
              data.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
                >
                  {post.attributes.img.data && (
                    <Image
                      src={post.attributes.img.data.attributes.formats.small?.url || post.attributes.img.data.attributes.formats.thumbnail.url}
                      alt={post.attributes.Title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-3xl font-semibold mb-2">{post.attributes.Title}</h2>
                    <p className="text-gray-400 text-sm">{post.attributes.shortDescription}</p>
                    <p className="text-gray-400 text-sm mb-4">{post.attributes.Date}</p>
                    <p className="text-gray-300 mb-6">{post.attributes.updatedAt}</p>
                    <Link href={`/article/${post.id}/${post.attributes.slug}`} className="text-green-400 hover:underline">
                      Read more →
                    </Link>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
