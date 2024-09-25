"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { FaSearch, FaHome, FaServer } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types/blog";

// Utility function to convert a string to uppercase
const toUpperCase = (str: string): string => str.toUpperCase();

// Fetch categories from API
const fetchCategories = async (): Promise<{ data: Category[] }> => {
  const url = "categories";
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export default function Submenu() {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Refs and router
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const getCategories = async () => {
      const storedCategories = localStorage.getItem("categories");

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
        setLoadingCategories(false);
      } else {
        try {
          const result = await fetchCategories();
          localStorage.setItem("categories", JSON.stringify(result.data));
          setCategories(result.data);
          setLoadingCategories(false);
        } catch (err) {
          setError("Error fetching categories");
          setLoadingCategories(false);
        }
      }
    };

    getCategories();
  }, []);

  // Handle clicks outside the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle blog search term changes
  const handleBlogSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBlogSearchTerm(value);
  };

  // Trigger search functionality
  const handleSearchClick = () => {
    if (blogSearchTerm.length > 2) {
      router.push(`/article/search/${encodeURIComponent(blogSearchTerm)}`);
    }
  };

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const searchInput = document.getElementById("blog-search");
        searchInput?.focus();
      }, 100);
    }
  };

  // Trigger search on pressing "Enter"
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  // Display error if any
  if (error) {
    return <div>{error}</div>;
  }

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
            {loadingCategories ? (
              <div className="flex space-x-4">
                <div className="w-24 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-24 h-6 bg-gray-800 animate-pulse rounded"></div>
                <div className="w-24 h-6 bg-gray-800 animate-pulse rounded"></div>
              </div>
            ) : categories.length > 0 ? (
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

            {/* Search Button */}
            <button onClick={handleSearchClick} className="hidden md:block text-green-400 hover:text-green-300 transition-colors duration-300">
              <FaSearch />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}