"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchBlogDetailData, viewCounter } from "@/app/lib/api";
// import { useSideBar } from "@/app/hooks/store";
import { BlogData, NewComment, Comment } from "@/app/types/blog";
import ContentRenderer from "@/app/components/ui/ContentRenderer";
import CommentsSection from "@/app/components/ui/CommentsSection";
import SocialSharing from "@/app/components/ui/SocialMedia";
import { Terminal, Server, Code, Eye, Calendar } from "lucide-react";

const BlogPost: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  // const { isOpen, toggleSidebar } = useSideBar();
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
        const postData = await fetchBlogDetailData(id);
        setData(postData);
        setComments(postData.data.attributes.comments.data as Comment[]);

        if (postData.data.attributes.viewCount !== undefined) {
          viewCounter(id, postData.data.attributes.viewCount);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error loading blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      setNewComment({ Name: "", Email: "", comment: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-green-400 py-10 animate-pulse">
          <Terminal className="w-16 h-16 mx-auto mb-4" />
          <div className="bg-gray-800 h-8 mb-4 w-3/4 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-2/3 mx-auto rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 text-xl py-10 animate-fadeIn">
          <Server className="w-16 h-16 mx-auto mb-4" />
          Error: {error}
        </div>
      );
    }

    if (!data || !data.data || !data.data.attributes) {
      return (
        <div className="text-center text-gray-300 text-xl py-10 animate-fadeIn">
          <Code className="w-16 h-16 mx-auto mb-4" />
          404: Post not found
        </div>
      );
    }

    const { Title, publishedAt, img, viewCount } = data.data.attributes;
    const imageUrl = img?.data?.attributes?.formats?.medium?.url || img?.data?.attributes?.url;

    return (
      <article className="text-green-400 bg-gray-900 rounded-lg  p-5 animate-fadeIn">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-400 animate-fadeInDown">
            {Title}
          </h1>
          <div className="flex items-center text-gray-400 text-sm space-x-6">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              {viewCount} views
            </span>
          </div>
        </header>
        {imageUrl && (
          <figure className="mb-8 animate-fadeInScale">
            <div className="relative w-full max-w-2xl mx-auto" style={{ maxHeight: '400px' }}>
              <Image
                src={imageUrl}
                alt={Title}
                width={800}
                height={400}
                objectFit="cover"
                className="rounded-lg shadow-lg border border-green-500"
              />
            </div>
          </figure>
        )}

        <div className="prose prose-invert max-w-none">
          <ContentRenderer description={data.data.attributes.description} />
        </div>

        <CommentsSection
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleCommentSubmit={handleCommentSubmit}
        />

        <SocialSharing
          shareUrl={typeof window !== "undefined" ? window.location.href : ""}
          title={Title}
          description={data.data.attributes.description}
        />
      </article>
    );
  };

  return (
    <div className="container">
      {renderContent()}
    </div>
  );
};

export default BlogPost;
