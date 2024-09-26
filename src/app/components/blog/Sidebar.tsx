'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaServer, FaCodeBranch, FaBook, FaClock, FaBars, FaTimes } from 'react-icons/fa';
import { fetchCategoriesWithSubcategories } from '@/app/lib/api';
import { useCategory } from '@/app/hooks/store';
import { Category, SubCategory } from '@/app/types/blog';

interface SidebarProps {
  children: ReactNode;
  initialCategoryData: { data: Category };
}

export default function DevOpsSidebar({ children, initialCategoryData }: SidebarProps) {
  const [categories, setCategories] = useState<SubCategory[]>(initialCategoryData.data.sub_categories || []);
  const [fullCategory, setFullCategory] = useState<Category | null>(initialCategoryData.data);
  const { categoryId } = useCategory();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log('initialCategoryData', initialCategoryData);

  useEffect(() => {
    const fetchCategories = async () => {
      if (categoryId === "0" || categoryId.toString() === initialCategoryData.data.id.toString()) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetchCategoriesWithSubcategories(categoryId.toString());
        if (response && response.data) {
          setFullCategory(response.data);
          setCategories(response.data.sub_categories);
        } else {
          setFullCategory(null);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setFullCategory(null);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [categoryId, initialCategoryData.data.id]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const truncateTitle = (title: string, limit: number) => {
    return title.length > limit ? title.slice(0, limit) + '...' : title;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-900 text-gray-300">
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          className="text-cyan-400 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <aside
        className={`fixed md:relative top-0 left-0 z-40 w-64 bg-gray-800 overflow-y-auto h-full border-r border-gray-700 custom-scrollbar transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-6">
                <FaServer className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold text-cyan-400">
                  {capitalizeFirstLetter(fullCategory?.Title || '')}
                </h2>
              </div>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.id} className="mb-4">
                    <div className="flex items-center mb-2 bg-gray-700 p-2 rounded-md">
                      <FaCodeBranch className="mr-2 text-cyan-400" size={16} />
                      <span className="text-lg font-semibold text-white">{category.Title}</span>
                    </div>
                    <ul className="pl-4 space-y-2">
                      {category.blogs.map((blog) => (
                        <li key={blog.id} className="bg-gray-750 rounded-md hover:bg-gray-700 transition-colors duration-150">
                          <Link href={`/article/${blog.documentId}/${blog.slug}`} className="block p-3">
                            <div className="flex items-center mb-1">
                              <FaBook className="mr-2 text-cyan-400" size={14} />
                              <span className="text-sm font-medium text-white">
                                {truncateTitle(blog.Title, 25)}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <FaClock className="mr-1" size={12} />
                              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-900 transition-all duration-300">
        <div>{children}</div>
      </main>
    </div>
  );
}