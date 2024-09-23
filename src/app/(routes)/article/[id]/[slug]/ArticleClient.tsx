"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchBlogDetailData, viewCounter } from "@/app/lib/api";
import { BlogData, NewComment, Comment } from "@/app/types/blog";
import ContentRenderer from "@/app/components/ui/ContentRenderer";
import SocialSharing from "@/app/components/ui/SocialMedia";
import { FaTerminal, FaServer, FaCode, FaEye, FaCalendarAlt } from "react-icons/fa";
import { useCategory } from "@/app/hooks/store";

// Memoized CommentsSection to prevent rerenders
// eslint-disable-next-line react/display-name
const MemoizedCommentsSection = React.memo(({
  comments,
  newComment,
  setNewComment,
  handleCommentSubmit,
}: {
  comments: Comment[];
  newComment: NewComment;
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) => {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-green-400 mb-2">Comments</h2>

      <ul className="mb-4 space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="text-green-300 font-semibold text-sm">{comment.attributes.Name}</p>
            <p className="text-gray-300 text-sm">{comment.attributes.comment}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit} className="space-y-3">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newComment.Name}
            onChange={(e) => setNewComment((prev) => ({ ...prev, Name: e.target.value }))}
            placeholder="Name"
            required
            className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            value={newComment.Email}
            onChange={(e) => setNewComment((prev) => ({ ...prev, Email: e.target.value }))}
            placeholder="Email"
            required
            className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <textarea
          value={newComment.comment}
          onChange={(e) => setNewComment((prev) => ({ ...prev, comment: e.target.value }))}
          placeholder="Your Comment"
          required
          className="w-full p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          rows={4}  // Medium size textarea
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white text-base font-medium rounded-md hover:bg-green-400 transition-colors"
        >
          Submit Comment
        </button>
      </form>
    </section>
  );
});
const ArticleClient: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { setCategoryId } = useCategory();
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
        setCategoryId(postData.data.attributes.categories.data[0].id);

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
  }, [id, setCategoryId]);

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

  // Memoized content to avoid unnecessary re-renders
  const renderContent = React.useMemo(() => {
    if (loading) {
      return (
        <div className="text-center text-green-400 py-10 animate-pulse">
          <FaTerminal className="w-16 h-16 mx-auto mb-4" />
          <div className="bg-gray-800 h-8 mb-4 w-3/4 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-2/3 mx-auto rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 text-xl py-10 animate-fadeIn">
          <FaServer className="w-16 h-16 mx-auto mb-4" />
          Error: {error}
        </div>
      );
    }

    if (!data || !data.data || !data.data.attributes) {
      return (
        <div className="text-center text-gray-300 text-xl py-10 animate-fadeIn">
          <FaCode className="w-16 h-16 mx-auto mb-4" />
          404: Post not found
        </div>
      );
    }

    const { Title, publishedAt, img, viewCount } = data.data.attributes;
    const imageUrl = img?.data?.attributes?.formats?.medium?.url || img?.data?.attributes?.url;

    return (
      <article className="text-green-400 bg-gray-900 rounded-lg p-5 animate-fadeIn">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-400 animate-fadeInDown">
            {Title}
          </h1>
          <div className="flex items-center text-gray-400 text-sm space-x-6">
            <span className="flex items-center">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <FaEye className="w-4 h-4 mr-2" />
              {viewCount} views
            </span>
          </div>
        </header>
        {imageUrl && (
          <figure className="mb-8 animate-fadeInScale">
            <Image
              src={imageUrl}
              alt={Title}
              width={800}
              height={400}
              objectFit="cover"
              className="rounded-lg shadow-lg border border-green-500"
            />
          </figure>
        )}

        <div className="prose prose-invert max-w-none">
          <ContentRenderer description={data.data.attributes.description} />
        </div>
      </article>
    );
  }, [loading, error, data]);

  return (
    <div className="container">
      {renderContent}
      <MemoizedCommentsSection
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        handleCommentSubmit={handleCommentSubmit}
      />
      <SocialSharing
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        title={data?.data?.attributes?.Title || ""}
        description={data?.data?.attributes?.description || ""}
      />
    </div>
  );
};

export default ArticleClient;