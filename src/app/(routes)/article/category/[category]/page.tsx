"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DynamicBanner from '@/app/components/blog/Blogroute';
import { Article } from "@/app/types/blog";
import Image from 'next/image'; // Import the Image component
import { fetchCategoryDetailsData } from '@/app/lib/api';
import SkeletonCard from '@/app/components/blog/DummyCard';
import Footer from '@/app/components/layout/Footer';

export default function Articles() {
  const params = useParams<{ category: string }>();
  const category = params?.category;
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
    <>

    {/* Use theme-aware background and text color for full inversion */}
    <div className="min-h-screen bg-white text-black dark:bg-neutral-900 dark:text-white transition-colors duration-300">

      <DynamicBanner />

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">
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
                    className="bg-white text-black dark:bg-neutral-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-gray-100 dark:bg-neutral-700">
                      {post.img[0]?.url ? (
                        <Image
                          src={post.img[0]?.url}
                          alt={post.Title}
                          layout="fill"
                          objectFit="cover" 
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-4xl text-gray-400 dark:text-gray-500">
                          &#123; &#125;
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-green-700 dark:text-green-400">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        {post.Title}
                      </h2>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">
                        <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/article/${post.slug}`}
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
                      >
                        $ cat article.md
                      </Link>
                    </div>
                  </article>
                ))
              : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                  <p className="text-2xl mb-4">No posts found in ~/articles/{category}</p>
                  <p className="text-lg">Try updating your search parameters or check back later.</p>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
     <Footer />
     </>
  );
}
