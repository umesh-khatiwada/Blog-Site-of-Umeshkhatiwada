/* eslint-disable @typescript-eslint/no-explicit-any */
// Add "use client" directive at the top to make this a Client Component
"use client";
import Header from '../components/Header';
import Submenu from '../components/Submenu';
import axios from 'axios';
import { useEffect, useState } from 'react';

// Submenu categories
const fetchBlogData = async () => {
  const url = 'blogs';
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Article() {
  const [data, setData] = useState<any[]>([]); // Initialize data as an array
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchBlogData();
        setData(result.data);
      } catch (err) {
        setError("Error fetching data");
      }
    };
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Dynamically included Header */}
      <Header />

      {/* Dynamic Submenu */}
      <Submenu />
      <div
        className="relative w-full h-80 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: 'url(/path/to/hexagonal-background.png)' }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 text-center py-20">
          <h1 className="text-6xl font-bold text-white">DevOps/Coding Articles</h1>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {data && data.length > 0 ? (
           data.map((data: any) => (
            <div
              key={data.id}
              className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-3xl font-semibold mb-2">{data.attributes.Title}</h2>
                <p className="text-gray-400 text-sm mb-4">{data.attributes.Date}</p>
                <p className="text-gray-300 mb-6">{data.attributes.updatedAt}</p>
                {/* Use dynamic routing for the blog post */}
                {/* <Link href={`/article/${post.slug}`} className="text-green-400 hover:underline">
                  Read more →
                </Link> */}
              </div>
            </div>
          ))      ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
