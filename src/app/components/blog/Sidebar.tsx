/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBook,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { fetchCategoriesWithSubcategories } from "@/app/lib/api";
import { Category } from "@/app/types/blog";
import { useCategory } from "@/app/hooks/store";

interface SidebarProps {
  children: ReactNode;
}

const DevOpsSidebar: React.FC<SidebarProps> = ({ children }) => {
  const [categoryData, setCategoryData] = useState<{ data: Category | null } | null>(null);
  const [oldcategoryid, setoldcategoryid] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { categoryId } = useCategory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      try {
        console.log("categoryId", categoryId);
        if (oldcategoryid == categoryId) {
          return;
          
        }
        if (categoryId === "null") {
          setCategoryData(null);
          return;
        } 
        setoldcategoryid(categoryId);
        const data = await fetchCategoriesWithSubcategories(categoryId);
        setCategoryData(data || { data: null });
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId, oldcategoryid]);

  // Sidebar Loading Skeleton
  const SidebarLoadingSkeleton = () => (
    <div className="medium-sidebar-content">
      <div className="medium-loading-skeleton">
        <div className="medium-loading-title"></div>
        <div className="medium-loading-line"></div>
        <div className="medium-loading-line"></div>
        <div className="medium-loading-line"></div>
      </div>
    </div>
  );

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const truncateTitle = (title: string, limit: number) => {
    return title.length > limit ? title.slice(0, limit) + "..." : title;
  };

  const renderSidebarContent = () => {
    if (isLoading || !categoryId) {
      return <SidebarLoadingSkeleton />;
    }

    if (categoryData && categoryData.data) {
      return (
        <div className="medium-sidebar-content">
          <div className="medium-sidebar-header">
            <h2 className="medium-sidebar-title">
              {capitalizeFirstLetter(categoryData.data.Title)}
            </h2>
          </div>
          <ul className="medium-sidebar-list">
            {categoryData.data.sub_categories.map((category) => (
              <li key={category.id} className="medium-sidebar-item">
                <div className="medium-sidebar-category">
                  <span className="medium-sidebar-category-title">
                    {category.Title}
                  </span>
                </div>
                <ul className="pl-4 space-y-2">
                  {category.blogs.map((blog) => (
                    <li
                      key={blog.id}
                      className="bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-150"
                    >
                      <Link
                        href={`/article/${blog.slug}`}
                        className="block p-3"
                      >
                        <div className="flex items-center mb-1">
                          <FaBook className="mr-2 text-green-400" size={14} />
                          <span className="text-sm font-medium text-white font-mono">
                            {truncateTitle(blog.Title, 25)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-white-400">
                          {/* <FaClock className="mr-1" size={12} />
                          <span>
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span> */}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div>No categories found.</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden text-gray-300">
      <div className="md:hidden fixed top-20 right-5 z-50">
        <button
          className="text-green-400 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={18} className="text-green-400" /> : <FaBars size={18} className="text-green-400" />}
        </button>
      </div>

      <aside
        className={`fixed md:relative top-0 left-0 z-40 w-64 bg-gray-800 overflow-y-auto h-full border-r border-gray-700 custom-scrollbar transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {renderSidebarContent()}
      </aside>

      <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
        <div>{children}</div>
      </main>
    </div>
  );
};

export default DevOpsSidebar;