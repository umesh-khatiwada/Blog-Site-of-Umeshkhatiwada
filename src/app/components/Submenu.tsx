/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Mark the component as a Client Component

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Fetch data function
const fetchData = async () => {
  const url = 'categories';
  try {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default function Submenu() {
  const [data, setData] = useState<any[]>([]); // Initialize data as an array
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchData();
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
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-center space-x-4">
        {data && data.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((data: any) => (
            <Link
              key={data.id}
              href={`/categories/${data.attributes.Title.toLowerCase()}`}
              className="text-purple-400 hover:text-purple-200"
            >
              {data.attributes.Title}
            </Link>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
