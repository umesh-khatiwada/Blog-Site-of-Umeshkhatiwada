/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Header from '@/app/components/layout/Header';
import Submenu from '@/app/components/layout/Submenu';
import { BlogData, SuggestedArticle } from '@/app/types/blog';
import { fetchBlogDetailData, fetchSuggestedArticles } from '@/app/lib/api';
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from 'react-icons/fa';  // Import icons
import Head from 'next/head';

export default function BlogPost() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<BlogData | null>(null);
  const [suggestedArticles, setSuggestedArticles] = useState<SuggestedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No ID provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [postData, suggestedData] = await Promise.all([
          fetchBlogDetailData(id),
          fetchSuggestedArticles()
        ]);
        setData(postData);
        setSuggestedArticles(suggestedData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error loading blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Share functionality
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-white font-bold text-xl py-10">
          <div className="animate-pulse">
            <div className="bg-gray-700 h-8 mb-4 w-3/4 mx-auto rounded"></div>
            <div className="bg-gray-700 h-4 mb-4 w-1/2 mx-auto rounded"></div>
            <div className="bg-gray-700 h-4 mb-4 w-2/3 mx-auto rounded"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 font-bold text-xl py-10 animate-fadeIn">
          {error}
        </div>
      );
    }

    if (!data || !data.data || !data.data.attributes) {
      return (
        <div className="text-center text-white font-bold text-xl py-10 animate-fadeIn">
          Post not found
        </div>
      );
    }

    const { Title, publishedAt, description, img } = data.data.attributes;
    const imageUrl = img?.data?.attributes?.formats?.medium?.url || img?.data?.attributes?.url;

    return (
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <article className="lg:w-2/3 bg-gray-800 p-8 rounded-lg shadow-lg animate-fadeInUp">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-green-400 animate-fadeInDown">
              {Title}
            </h1>
            <p className="text-gray-400 text-sm animate-fadeIn">
              Published on {new Date(publishedAt).toLocaleDateString()}
            </p>
          </header>

          {imageUrl && (
            <figure className="mb-8 animate-fadeInScale">
              <Image
                src={imageUrl}
                alt={Title}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full rounded-lg shadow-lg"
              />
            </figure>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            <BlocksRenderer
              content={description}
              blocks={{
                paragraph: ({ children }) => (
                  <p className="mb-4 animate-fadeInRight">{children}</p>
                ),
                heading: ({ children, level }) => {
                  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag className="font-bold mt-6 mb-4 text-green-300 animate-fadeInLeft">
                      {children}
                    </HeadingTag>
                  );
                },
                list: ({ children, format }) => {
                  const ListTag = format === 'ordered' ? 'ol' : 'ul';
                  return (
                    <ListTag className="list-inside mb-4 pl-4 animate-fadeInRight">
                      {children}
                    </ListTag>
                  );
                },
                'list-item': ({ children }) => (
                  <li className="mb-2 animate-fadeInRight">{children}</li>
                ),
                link: ({ children, url }) => (
                  <a
                    href={url}
                    className="text-blue-400 hover:underline transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                quote: ({ children }) => (
                  <blockquote className="border-l-4 border-green-400 pl-4 py-2 italic mb-4 bg-gray-700 rounded-r animate-fadeInScale">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto mb-4 animate-fadeInScale">
                    <code className="text-sm text-green-300">{children}</code>
                  </pre>
                ),
                image: ({ image }) => (
                  <figure className="mb-4 animate-fadeInScale">
                    <Image
                      src={image.url}
                      alt={image.alternativeText || ''}
                      width={800}
                      height={600}
                      className="rounded-lg shadow-lg"
                    />
                    {image.caption && (
                      <figcaption className="text-center text-gray-400 mt-2">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ),
              }}
            />
          </div>

          {/* Social Sharing Buttons */}
          <div className="mt-8">
            <h3 className="text-2xl text-green-400 mb-4">Share this article:</h3>
            <div className="flex space-x-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <FaFacebook size={32} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${Title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
              >
                <FaTwitter size={32} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${Title}&summary=${description}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 transition-colors duration-200"
              >
                <FaLinkedin size={32} />
              </a>
              <button
                onClick={handleCopyLink}
                className="text-green-400 hover:text-green-600 transition-colors duration-200"
              >
                <FaCopy size={32} />
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar with suggested articles */}
        <aside className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInRight">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Suggested Articles</h2>
            {suggestedArticles.map((article) => (
              <div key={article.id} className="mb-4 pb-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded mr-4"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-green-300">{article.title}</h3>
                    <p className="text-gray-400 text-sm">{article.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{data?.data?.attributes?.Title || 'Blog Post'} - My Blog</title>
        <meta name="description" content={data?.data?.attributes?.description || 'Blog post'} />
        <meta property="og:title" content={data?.data?.attributes?.Title || 'Blog Post'} />
        <meta property="og:description" content={data?.data?.attributes?.description} />
        <meta property="og:image" content={data?.data?.attributes?.img?.data?.attributes?.url} />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Submenu />
        <br></br>
        {renderContent()}
      </main>
    </div>
  );
}
