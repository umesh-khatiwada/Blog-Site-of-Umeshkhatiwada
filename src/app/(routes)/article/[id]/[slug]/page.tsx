/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Header from "@/app/components/layout/Header";
import Submenu from "@/app/components/layout/Submenu";
import { BlogData, SuggestedArticle } from "@/app/types/blog";
import {
  fetchBlogDetailData,
  fetchSuggestedArticles,
  viewCounter,
} from "@/app/lib/api";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from "react-icons/fa"; // Import icons
import Head from "next/head";
import Link from "next/link";

// Define types for comments
interface Comment {
  id: string;
  attributes: {
    Name: string;
    Email: string;
    comment: string;
    createdAt: string;
  };
}

interface NewComment {
  Name: string;
  Email: string;
  comment: string;
}

export default function BlogPost() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<BlogData | null>(null);
  const [suggestedArticles, setSuggestedArticles] = useState<SuggestedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<NewComment>({
    Name: "",
    Email: "",
    comment: "",
  });

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [postData, suggestedData] = await Promise.all([
          fetchBlogDetailData(id),
          fetchSuggestedArticles(),
        ]);

        setData(postData);
        setSuggestedArticles(suggestedData);
        setComments(postData.data.attributes.comments.data as Comment[]);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error loading blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Call viewCounter with updated viewCount
    if (data?.data?.attributes?.viewCount !== undefined) {
      viewCounter(id, data.data.attributes.viewCount);
    }
  }, [id, data?.data?.attributes?.viewCount]);

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}comments/`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_STRAPI_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              blog: id,
              Email: newComment.Email,
              Name: newComment.Name,
              comment: newComment.comment,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const commentData = await response.json();
      setComments((prevComments) => [...prevComments, commentData.data as Comment]);
      setNewComment({ Name: "", Email: "", comment: "" }); // Clear form
    } catch (error) {
      console.error(error);
    }
  };

  // Share functionality
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-gray-300 font-mono py-10 animate-pulse">
          <div className="bg-gray-800 h-8 mb-4 w-3/4 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-2/3 mx-auto rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 font-mono text-xl py-10 animate-fadeIn">
          Error: {error}
        </div>
      );
    }

    if (!data || !data.data || !data.data.attributes) {
      return (
        <div className="text-center text-gray-300 font-mono text-xl py-10 animate-fadeIn">
          404: Post not found
        </div>
      );
    }

    const { Title, publishedAt, description, img } = data.data.attributes;
    const imageUrl = img?.data?.attributes?.formats?.medium?.url || img?.data?.attributes?.url;

    return (
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <article className="lg:w-2/3 bg-gray-900 p-8 rounded-lg shadow-lg border border-green-500 animate-fadeInUp">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-green-400 font-mono animate-fadeInDown">
              {Title}
            </h1>
            <p className="text-gray-400 text-sm font-mono animate-fadeIn">
              Deployed on {new Date(publishedAt).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-sm font-mono animate-fadeIn">
              Hits: {data.data.attributes.viewCount}
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
                className="w-full rounded-lg shadow-lg border border-green-500"
              />
            </figure>
          )}

          <div className="prose prose-lg prose-invert max-w-none font-mono">
            <BlocksRenderer
              content={description}
              blocks={{
                paragraph: ({ children }) => (
                  <p className="mb-4 animate-fadeInRight text-gray-300">{children}</p>
                ),
                heading: ({ children, level }) => {
                  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag className="font-bold mt-6 mb-4 text-green-400 animate-fadeInLeft">
                      {children}
                    </HeadingTag>
                  );
                },
                list: ({ children, format }) => {
                  const ListTag = format === "ordered" ? "ol" : "ul";
                  return (
                    <ListTag className="list-inside mb-4 pl-4 animate-fadeInRight text-gray-300">
                      {children}
                    </ListTag>
                  );
                },
                "list-item": ({ children }) => (
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
                  <blockquote className="border-l-4 border-green-500 pl-4 py-2 italic mb-4 bg-gray-800 rounded-r animate-fadeInScale text-gray-300">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <pre className="bg-black p-4 rounded-md overflow-x-auto mb-4 animate-fadeInScale">
                    <code className="text-sm text-green-400">{children}</code>
                  </pre>
                ),
                image: ({ image }) => (
                  <figure className="mb-4 animate-fadeInScale">
                    <Image
                      src={image.url}
                      alt={image.alternativeText || ""}
                      width={800}
                      height={600}
                      className="rounded-lg shadow-lg border border-green-500"
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

          {/* Comments Section */}
          <section className="mt-8">
            <h3 className="text-2xl text-green-400 mb-4 font-mono">Logs</h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-green-500">
                  <p className="font-bold text-green-400 font-mono">{comment.attributes.Name}</p>
                  <p className="text-gray-400 text-sm font-mono">{new Date(comment.attributes.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2 text-gray-300 font-mono">{comment.attributes.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comment Submission Form */}
          <section className="mt-8">
            <h3 className="text-2xl text-green-400 mb-4 font-mono">Push a Log</h3>
            <form onSubmit={handleCommentSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-green-500">
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300 mb-2 font-mono">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newComment.Name}
                  onChange={(e) => setNewComment({ ...newComment, Name: e.target.value })}
                  className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2 font-mono">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newComment.Email}
                  onChange={(e) => setNewComment({ ...newComment, Email: e.target.value })}
                  className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-300 mb-2 font-mono">Log Message</label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 font-mono"
              >
                Push Log
              </button>
            </form>
          </section>

          {/* Social Sharing Buttons */}
          <div className="mt-8">
            <h3 className="text-2xl text-green-400 mb-4 font-mono">Share this deployment:</h3>
            <div className="flex space-x-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                <FaFacebook size={32} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${Title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 transition-colors duration-200"
              >
                <FaTwitter size={32} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${Title}&summary=${description}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <FaLinkedin size={32} />
              </a>
              <button
                onClick={handleCopyLink}
                className="text-green-500 hover:text-green-600 transition-colors duration-200"
              >
                <FaCopy size={32} />
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar with suggested articles */}
        <aside className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-green-500 animate-fadeInRight">
            <h2 className="text-2xl font-bold mb-4 text-green-400 font-mono">Related Deployments</h2>
            {suggestedArticles.map((article) => (
              <div key={article.id} className="mb-4 pb-4 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <Image
                    src={article.attributes.img.data.attributes.url}
                    alt={article.attributes.img.data.attributes.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded mr-4 border border-green-500"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-green-400 font-mono">{article.attributes.Title}</h3>
                    <p className="text-gray-400 text-sm font-mono">{article.attributes.shortDescription}</p>
                    <p className="text-gray-400 text-sm font-mono">{new Date(article.attributes.publishedAt).toLocaleDateString()}</p>
                    <Link href={`/article/${article.id}/${article.attributes.slug}`} className="text-green-500 hover:underline font-mono">
                      View deployment →
                    </Link>
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
    <div className="min-h-screen bg-black text-gray-300">
      <Head>
        <title>{data?.data?.attributes?.Title || "Deployment Log"} - DevOps Blog</title>
        <meta name="description" content={data?.data?.attributes?.description || "Deployment log"} />
        <meta property="og:title" content={data?.data?.attributes?.Title || "Deployment Log"} />
        <meta property="og:description" content={data?.data?.attributes?.description} />
        <meta property="og:image" content={data?.data?.attributes?.img?.data?.attributes?.url} />
      </Head>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Submenu />
        <br />
        {renderContent()}
      </main>
    </div>
  );
}