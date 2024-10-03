"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DynamicBanner from '@/app/components/blog/Blogroute';
import { Article, ArticlesProps } from '@/app/types/blog';
import { fetchBlogData } from '@/app/lib/api';
import Pagination from '@/app/components/blog/Pagination';
import { DummyCard } from '@/app/components/blog/DummyCard';
import Footer from '@/app/components/layout/Footer';

export default function Articles({ initialData }: ArticlesProps) {
  const [data, setData] = useState<Article[]>(initialData.data);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(initialData.meta.pagination.total / 6)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [linkLoading, setLinkLoading] = useState<boolean>(false);

  const fetchPageData = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchBlogData(page);
      setData(result.data);
      const totalPages = Math.ceil(result.meta.pagination.total / 6);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      fetchPageData(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLinkClick = () => {
    setLinkLoading(true);
  };

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-white ${linkLoading ? 'cursor-wait' : ''}`}>
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
            : data.map((post) => {
              const title = post.Title.split(' ').slice(0, 5).join(' ') + (post.Title.split(' ').length > 5 ? '...' : '');
              return (
                <article
                  key={post.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {post.img && post.img[0]?.formats?.thumbnail?.url && (
                    <div className="relative h-48">
                      <Image
                        src={post.img[0]?.url}
                        alt={post.Title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-300 hover:opacity-80"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                      {title}
                    </h2>
                    <p className="text-white-400 text-sm mb-4">
                      {post.shortDescription.split(' ').slice(0, 20).join(' ') + (post.shortDescription.split(' ').length > 20 ? '...' : '')}
                    </p>
                    <div className="flex justify-between items-center text-sm text-white-500 mb-4">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      href={`/article/${post.slug}`}
                      className="btn-read-more"
                      onClick={handleLinkClick}
                    >
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Footer />
    </div>
  );
}
