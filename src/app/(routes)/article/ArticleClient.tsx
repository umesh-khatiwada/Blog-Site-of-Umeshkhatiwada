"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import DynamicBanner from '@/app/components/blog/Blogroute';
import { Article, ArticlesProps } from '@/app/types/blog';
import { fetchBlogData } from '@/app/lib/api';
import Pagination from '@/app/components/blog/Pagination';
import { DummyCard } from '@/app/components/blog/DummyCard';
import Footer from '@/app/components/layout/Footer';

export default function Articles({ initialData }: ArticlesProps) {
  const [data, setData] = useState<Article[]>(initialData?.data || []);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(
    initialData?.meta?.pagination?.total 
      ? Math.ceil(initialData.meta.pagination.total / 6)
      : 1
  );
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [linkLoading, setLinkLoading] = useState<boolean>(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [showRefreshNotification, setShowRefreshNotification] = useState<boolean>(false);

  const fetchPageData = useCallback(async (page: number, isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true);
    }
    setError(null);
    try {
      const result = await fetchBlogData(page);
      if (!result || !result.data) {
        throw new Error('No data received');
      }
      setData(result.data);
      const total = result.meta?.pagination?.total || 0;
      setTotalPages(Math.max(1, Math.ceil(total / 6)));
      setLastFetched(new Date());
      
      if (isAutoRefresh) {
        console.log('Data auto-refreshed at:', new Date().toLocaleTimeString());
        setShowRefreshNotification(true);
        // Hide notification after 3 seconds
        setTimeout(() => setShowRefreshNotification(false), 3000);
      }
    } catch (err: Error | unknown) {
      console.error("Error fetching data:", err);
      if (!isAutoRefresh) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'object' && err && 'response' in err) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          setError(axiosError.response?.data?.message || "Unable to load articles. Please try again later.");
        } else {
          setError("An unexpected error occurred");
        }
        // Keep existing data if available
        if (!data.length) {
          setData([]);
        }
      } else {
        // For auto-refresh, just log the error silently
        console.warn('Auto-refresh failed, keeping existing data');
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  }, [data.length]);

  useEffect(() => {
    if (!initialData && currentPage === 1) {
      fetchPageData(1);
    } else if (currentPage > 1) {
      fetchPageData(currentPage);
    }
  }, [currentPage, initialData, fetchPageData]);

  // Set up auto-refresh every hour
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only auto-refresh if we're on the first page and have data
      if (currentPage === 1 && data.length > 0) {
        fetchPageData(1, true); // true indicates this is an auto-refresh
      }
    }, 60 * 60 * 1000); // 1 hour in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentPage, data.length, fetchPageData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLinkClick = () => {
    setLinkLoading(true);
  };

  const handleManualRefresh = () => {
    fetchPageData(currentPage);
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

      {/* Auto-refresh notification */}
      {showRefreshNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Articles updated automatically
        </div>
      )}

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="text-blue-400">&lt;</span>
          DevOps and Coding Articles
          <span className="text-blue-400">/&gt;</span>
        </h1>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-400">
            {lastFetched && (
              <span>Last updated: {lastFetched.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

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
              const title = post.Title && typeof post.Title === 'string' 
                ? post.Title.split(' ').slice(0, 5).join(' ') + (post.Title.split(' ').length > 5 ? '...' : '')
                : 'Untitled Article';
              return (
                <article
                  key={post.id}
                  className="bg-white-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {post.img && post.img[0]?.formats?.thumbnail?.url && (
                    <div className="relative h-48">
                      <Image
                        src={post.img[0]?.url}
                        alt={post.Title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-opacity duration-300 hover:opacity-80"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-300">
                      {title}
                    </h2>
                    <p className="text-white-400 text-sm mb-4">
                      {post.shortDescription && typeof post.shortDescription === 'string'
                        ? post.shortDescription.split(' ').slice(0, 20).join(' ') + (post.shortDescription.split(' ').length > 20 ? '...' : '')
                        : 'No description available.'}
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
