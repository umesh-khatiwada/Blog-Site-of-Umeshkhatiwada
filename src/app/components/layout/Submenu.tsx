"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { FaSearch, FaHome, FaCode, FaServer } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Interfaces for data structures
interface Category {
  id: string;
  attributes: {
    Title: string;
  };
}

interface BlogPost {
  id: number;
  attributes: {
    Title: string;
    slug: string;
  };
}

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

// Fetch blog posts from API
const fetchBlogPosts = async (searchTerm: string): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs`, {
      params: {
        "filters[Title][$containsi]": searchTerm,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export default function Submenu() {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [blogSuggestions, setBlogSuggestions] = useState<BlogPost[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [loadingBlogSuggestions, setLoadingBlogSuggestions] = useState<boolean>(false);

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
        setBlogSuggestions([]);
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
    if (value.length > 2) {
      setLoadingBlogSuggestions(true);
      const posts = await fetchBlogPosts(value);
      setBlogSuggestions(posts);
      setLoadingBlogSuggestions(false);
    } else {
      setBlogSuggestions([]);
    }
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

  // Clear suggestions when an item is clicked
  const handleSuggestionClick = () => {
    setBlogSuggestions([]);
    setBlogSearchTerm("");
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
                  href={`/article/category/${item.attributes.Title}`}
                  className="text-green-400 hover:text-green-300 mb-2 md:mb-0 font-mono transition-colors duration-300 flex items-center"
                >
                  <FaServer className="mr-1" />
                  {toUpperCase(item.attributes.Title)}
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

              {/* Suggestions Dropdown */}
              {loadingBlogSuggestions ? (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-green-500 rounded-lg shadow-lg">
                  <div className="px-4 py-2 text-green-400 animate-pulse font-mono">$ Loading...</div>
                </div>
              ) : blogSuggestions.length > 0 ? (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-green-500 rounded-lg shadow-lg">
                  {blogSuggestions.map((post) => (
                    <Link
                      key={post.id}
                      href={`/article/${post.id}/${post.attributes.slug}`}
                      className="block px-4 py-2 text-green-400 hover:bg-gray-700 font-mono transition-colors duration-300 flex items-center"
                      onClick={handleSuggestionClick}
                    >
                      <FaCode className="mr-2" />
                      {post.attributes.Title}
                    </Link>
                  ))}
                </div>
              ) : null}
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