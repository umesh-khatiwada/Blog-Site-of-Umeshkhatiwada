import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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

const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

const fetchCategories = async (): Promise<{ data: Category[] }> => {
  const url = 'categories';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const fetchBlogPosts = async (searchTerm: string): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs`, {
      params: {
        'filters[Title][$containsi]': searchTerm
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export default function Submenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [blogSuggestions, setBlogSuggestions] = useState<BlogPost[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      const storedCategories = localStorage.getItem('categories');
      
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        try {
          const result = await fetchCategories();
          localStorage.setItem('categories', JSON.stringify(result.data));
          setCategories(result.data);
        } catch (err) {
          setError("Error fetching categories");
        }
      }
    };
    
    getCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setBlogSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleBlogSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBlogSearchTerm(value);
    if (value.length > 2) {
      const posts = await fetchBlogPosts(value);
      setBlogSuggestions(posts);
    } else {
      setBlogSuggestions([]);
    }
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
        const searchInput = document.getElementById('blog-search');
        searchInput?.focus();
      }, 100);
    }
  };

  const handleSuggestionClick = () => {
    setBlogSuggestions([]);
    setBlogSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 mb-4 md:mb-0">
            {categories.length > 0 ? (
              categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/category/${item.attributes.Title}`}
                  className="text-purple-400 hover:text-purple-200 mb-2 md:mb-0"
                >
                  {toUpperCase(item.attributes.Title)}
                </Link>
              ))
            ) : (
              <div>No categories found</div>
            )}
          </div>

          <div className="flex items-center space-x-2" ref={searchRef}>
            <div className="relative">
              <input
                id="blog-search"
                type="text"
                placeholder="Search blog posts"
                value={blogSearchTerm}
                onChange={handleBlogSearchChange}
                onKeyDown={handleKeyDown}
                className={`px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-400 transition-all duration-300 ${isSearchVisible ? 'w-full' : 'w-0 md:w-48'}`}
              />
              <button
                onClick={toggleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white md:hidden"
              >
                <FaSearch />
              </button>
              {blogSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                  {blogSuggestions.map((post) => (
                    <Link
                      key={post.id}
                      href={`/article/${post.id}/${post.attributes.slug}`}
                      className="block px-4 py-2 text-white hover:bg-gray-800"
                      onClick={handleSuggestionClick}
                    >
                      {post.attributes.Title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleSearchClick} className="hidden md:block text-white">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
