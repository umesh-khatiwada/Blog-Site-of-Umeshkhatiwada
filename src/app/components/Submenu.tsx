"use client"; // Add this line to mark the component as a Client Component

// import Image from 'next/image';
import Link from 'next/link';
// import { useState } from 'react';

export default function Submenu() {
//   const [isMenuOpen, setMenuOpen] = useState(false);

// Submenu categories
const categories = [
    { name: 'HTML', link: '/categories/html' },
    { name: 'CSS', link: '/categories/css' },
    { name: 'JS', link: '/categories/js' },
    { name: 'C', link: '/categories/c' },
    { name: 'C++', link: '/categories/cpp' },
    { name: 'Java', link: '/categories/java' },
    { name: 'Python', link: '/categories/python' },
    { name: 'PHP', link: '/categories/php' },
    { name: 'React JS', link: '/categories/reactjs' },
  ];
  


  return (
    <div className="bg-gray-800 py-4">
    <div className="container mx-auto flex justify-center space-x-4">
      {categories.map((category) => (
        <Link key={category.name} href={category.link} className="text-purple-400 hover:text-purple-200">
          {category.name}
        </Link>
      ))}
    </div>
  </div>
  );
}
