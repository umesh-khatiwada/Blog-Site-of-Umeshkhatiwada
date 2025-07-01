"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { FaSearch, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types/blog";

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
    <div className="medium-submenu">
      <div className="medium-submenu-container">
        <div className="medium-submenu-content">

          {/* Home Link */}
          <div className="medium-submenu-home">
            <Link href="/" className="medium-submenu-link">
              <FaHome size={20} />
              <span className="medium-hidden-mobile">Home</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="medium-submenu-categories">
            {categories && categories.length > 0 ? (
              categories.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/category/${item.Title}`}
                  className="medium-submenu-category-link"
                >
                  {item.Title}
                </Link>
              ))
            ) : (
              <div className="medium-submenu-empty">No categories found</div>
            )}
          </div>

          {/* Search */}
          <div className="medium-submenu-search" ref={searchRef}>
            <div className="medium-search-container">
              <button
                onClick={toggleSearch}
                className="medium-search-toggle"
                aria-label="Toggle search"
              >
                <FaSearch />
              </button>
              <div className={`medium-search-input-wrapper ${isSearchVisible ? "medium-search-visible" : ""}`}>
                <input
                  id="blog-search"
                  type="text"
                  placeholder="Search"
                  value={blogSearchTerm}
                  onChange={handleBlogSearchChange}
                  onKeyDown={handleKeyDown}
                  className="medium-search-input"
                />
                <button 
                  onClick={handleSearchClick} 
                  className="medium-search-button"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Home Link visible in mobile view, hidden on desktop */}
            <div className="flex items-center mb-2 md:mb-0 block md:hidden">
              <Link href="/" className="text-green-400 hover:text-green-300 transition-colors duration-300">
                <FaHome size={24} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}