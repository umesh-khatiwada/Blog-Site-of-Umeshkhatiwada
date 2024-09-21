"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// import Header from '@/app/components/layout/Header';
import DynamicBanner from '@/app/components/blog/Blogroute';
// import Submenu from '@/app/components/layout/Submenu';
import { BlogPost } from '@/app/types/blog';
import { fetchBlogData } from '@/app/lib/api';
import Pagination from '@/app/components/blog/Pagination';
import { DummyCard } from '@/app/components/blog/DummyCard';
import Footer from '@/app/components/layout/Footer';
import { useMetaData } from "@/app/hooks/store";



export default function Article() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const { setMetaData} = useMetaData();


  
  const fetchPageData = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchBlogData(page);
      setData(result.data);
      const totalPages = Math.ceil(result.meta.pagination.total / 6);
      setTotalPages(totalPages);
      setMetaData({  title: "Blog", description: "Blog" });
  
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
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DynamicBanner />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-blue-400">&lt;</span>
          DevOps and Coding Articles
          <span className="text-blue-400">/&gt;</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <DummyCard key={index} />
              ))
            : data.length === 0
            ? (
                <div className="col-span-full text-center text-xl">
                  No posts found. Check back later!
                </div>
              )
            : data.map((post) => (
              <>
              <article
                key={post.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                  {post.attributes.img.data && (
                    <div className="relative h-48">
                      <Image
                        src={post.attributes.img.data.attributes.formats.small?.url || post.attributes.img.data.attributes.formats.thumbnail.url}
                        alt={post.attributes.Title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-300 hover:opacity-80" />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                      {post.attributes.Title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      {post.attributes.shortDescription}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{new Date(post.attributes.Date).toLocaleDateString()}</span>
                      <span>Last updated: {new Date(post.attributes.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      href={`/article/${post.id}/${post.attributes.slug}`}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article></>
              ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <footer className="bg-gray-800 text-center py-6 mt-12">
        {/* <p>&copy; 2024 DevOps Blog. All rights reserved.</p> */}
      </footer>

      <Footer />
    </div>
  );
}