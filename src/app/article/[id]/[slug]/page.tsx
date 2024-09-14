/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Submenu from '@/app/components/Submenu';
import axios from 'axios';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

interface ImageFormats {
  thumbnail: { url: string };
  medium: { url: string };
  small: { url: string };
  large: { url: string };
}

interface ImageAttributes {
  name: string;
  formats: ImageFormats;
  url: string;
}

interface SuggestedArticle {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
}

interface BlogAttributes {
  Title: string;
  publishedAt: string;
  description: any;
  img?: {
    data: {
      attributes: ImageAttributes;
    };
  };
}

interface BlogData {
  data: {
    id: number;
    attributes: BlogAttributes;
  };
}

const fetchBlogDetailData = async (id: string): Promise<BlogData> => {
  const url = 'blogs';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}/${id}?populate=*`);
    if (response.status === 404) {
      throw new Error('Blog post not found');
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Blog post not found');
    }
    throw new Error('Error fetching data');
  }
};
const fetchSuggestedArticles = async (): Promise<SuggestedArticle[]> => {
  // In a real application, this would make an API call
  const imageurl = 'https://d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2023/07/13220529/Artificial-Intelligence-in-Indonesia-The-current-state-and-its-opportunities.jpeg';
  return [
    { id: 1, title: "5 Tips for Better Coding", excerpt: "Improve your coding skills with these tips...", imageUrl: imageurl },
    { id: 2, title: "The Future of AI", excerpt: "Explore the latest trends in artificial intelligence...", imageUrl: imageurl },
    { id: 3, title: "Web Design Trends 2024", excerpt: "Stay ahead with these cutting-edge web design trends...", imageUrl: imageurl },
  ];
};

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
              <img src={imageUrl} alt={Title} className="w-full rounded-lg shadow-lg" />
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
                listItem: ({ children }) => (
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
                    <img
                      src={image.url}
                      alt={image.alternativeText || ''}
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
        </article>
        <aside className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInRight">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Suggested Articles</h2>
            {suggestedArticles.map((article) => (
              <div key={article.id} className="mb-4 pb-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <img src={article.imageUrl} alt={article.title} className="w-16 h-16 object-cover rounded mr-4" />
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
      <Header />
      <Submenu />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </main>
    </div>
  );
}