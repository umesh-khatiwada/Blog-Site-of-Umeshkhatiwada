"use client"; // Mark this component as a Client Component

import { useParams } from 'next/navigation';
import Header from '../../components/Header'; // Adjust the import path if needed
import Submenu from '@/app/components/Submenu';

const blogPosts = [
    {
        id: 1,
        title: 'Introduction to DevOps',
        description: 'Learn the basics of DevOps and how it can help streamline software development.',
        date: 'September 8, 2024',
        slug: 'introduction-to-devops',
        content: 'This is the full content of the Introduction to DevOps blog post...',
      },
      {
        id: 2,
        title: 'Top DevOps Tools in 2024',
        description: 'A comprehensive guide to the top DevOps tools you should be using in 2024.',
        date: 'September 1, 2024',
        slug: 'top-devops-tools-2024',
        content: 'This is the full content of the Top DevOps Tools in 2024 blog post...',
      },
      {
        id: 3,
        title: 'Continuous Integration Explained',
        description: 'An in-depth look at Continuous Integration and its role in the DevOps pipeline.',
        date: 'August 25, 2024',
        slug: 'continuous-integration-explained',
        content: 'This is the full content of the Continuous Integration Explained blog post...',
      },

];

export default function BlogPost() {
  const { slug } = useParams(); // Get slug from params

  // Find the post that matches the slug
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <div className="text-center text-black font-bold text-500 py-10">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header />
      <Submenu />
      {/* Blog Post Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-green-400">{post.title}</h1>
          <p className="text-gray-400 text-sm mb-6">Published on {post.date}</p>
          <p className="text-gray-300 leading-relaxed mb-8">{post.content}</p>
        </div>
      </div>
    </div>
  );
}
