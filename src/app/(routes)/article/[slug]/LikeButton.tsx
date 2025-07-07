"use client";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function LikeButton({ slug }: { slug: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Get like state and count from localStorage
    const stored = localStorage.getItem(`like-${slug}`);
    const countStored = localStorage.getItem(`like-count-${slug}`);
    setLiked(stored === "true");
    setCount(countStored ? parseInt(countStored, 10) : 0);
  }, [slug]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setCount((c) => {
        const newCount = Math.max(0, c - 1);
        localStorage.setItem(`like-count-${slug}` , newCount.toString());
        return newCount;
      });
      localStorage.setItem(`like-${slug}`, "false");
    } else {
      setLiked(true);
      setCount((c) => {
        const newCount = c + 1;
        localStorage.setItem(`like-count-${slug}` , newCount.toString());
        return newCount;
      });
      localStorage.setItem(`like-${slug}`, "true");
    }
  };

  return (
    <button
      aria-label={liked ? "Unlike" : "Like"}
      onClick={handleLike}
      className={`flex items-center gap-2 text-xl focus:outline-none transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
      style={{ border: "none", background: "none", cursor: "pointer" }}
    >
      {liked ? <FaHeart /> : <FaRegHeart />} {count}
    </button>
  );
}
