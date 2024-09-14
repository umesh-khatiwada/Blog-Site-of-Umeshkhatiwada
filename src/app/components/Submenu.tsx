"use client"; // Mark the component as a Client Component

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  attributes: {
    Title: string;
  };
}

// Convert string to camel case
// const toCamelCase = (str: string): string => {
//   return str
//     .replace(/(?:^\w|[A-Z]|\b\w|\s+|_)/g, (match, index) => 
//       index === 0 ? match.toLowerCase() : match.toUpperCase()
//     )
//     .replace(/\s+|_/g, '');
// };



// Convert string to uppercase
const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

// Fetch data function
const fetchData = async (): Promise<{ data: Category[] }> => {
  const url = 'categories';
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Submenu() {
  const [data, setData] = useState<Category[]>([]); // Initialize data as an array of Category
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      // Check localStorage for data
      const storedData = localStorage.getItem('categories');
      
      if (storedData) {
        // Parse and set data from localStorage
        setData(JSON.parse(storedData));
      } else {
        // Fetch data from API if not found in localStorage
        try {
          const result = await fetchData();
          // Store fetched data in localStorage
          localStorage.setItem('categories', JSON.stringify(result.data));
          setData(result.data);
        } catch (err) {
          setError("Error fetching data");
        }
      }
    };
    
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-center space-x-4">
        {data && data.length > 0 ? (
          data.map((item) => (
            <Link
              key={item.id}
              href={`/article/category/${item.attributes.Title}`}
              className="text-purple-400 hover:text-purple-200"
            >
              {toUpperCase(item.attributes.Title)}
            </Link>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
