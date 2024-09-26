"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaSearch, FaHome, FaServer } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types/blog";

const toUpperCase = (str: string): string => str.toUpperCase();

interface SubmenuProps {
  categories: Category[] | undefined;
}

export default function Submenu({ categories }: SubmenuProps) {
  const [blogSearchTerm, setBlogSearchTerm] = useState<string>("");
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBlogSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBlogSearchTerm(value);
  };

  const handleSearchClick = () => {
    if (blogSearchTerm.length > 2) {
      router.push(`/article/search/${encodeURIComponent(blogSearchTerm)}`);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const searchInput = document.getElementById("blog-search");
        searchInput?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="bg-gray-900 py-4 border-b border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Left Section: Home Link */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link href="/" className="text-green-400 hover:text-green-300 transition-colors duration-300">
              <FaHome size={24} />
            </Link>
          </div>
          
          {/* Middle Section: Categories */}
          <div className="flex justify-center flex-wrap space-x-4 mb-4 md:mb-0">
            {categories && categories.length > 0 ? (
              categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/category/${item.Title}`}
                  className="text-green-400 hover:text-green-300 mb-2 md:mb-0 font-mono transition-colors duration-300 flex items-center"
                >
                  <FaServer className="mr-1" />
                  {toUpperCase(item.Title)}
                </Link>
              ))
            ) : (
              <div className="text-yellow-500 font-mono">$ No categories found</div>
            )}
          </div>

          {/* Right Section: Search Input */}
          <div className="flex items-center space-x-2" ref={searchRef}>
            <div className="relative">
              <input
                id="blog-search"
                type="text"
                placeholder="$ grep blogs"
                value={blogSearchTerm}
                onChange={handleBlogSearchChange}
                onKeyDown={handleKeyDown}
                className={`px-4 py-2 rounded-lg bg-gray-800 text-green-400 border border-green-500 focus:outline-none focus:border-green-300 transition-all duration-300 font-mono ${isSearchVisible ? 'w-full' : 'w-0 md:w-48'}`}
              />
              <button
                onClick={toggleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-400 md:hidden"
              >
                <FaSearch />
              </button>
            </div>

            <button onClick={handleSearchClick} className="hidden md:block text-green-400 hover:text-green-300 transition-colors duration-300">
              <FaSearch />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
