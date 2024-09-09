import Link from 'next/link';
import Header from '../components/Header';

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

export default function Blog() {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Dynamically included Header */}
      <Header />

      {/* Dynamic Submenu */}
      <div className="bg-gray-800 py-4">
        <div className="container mx-auto flex justify-center space-x-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.link} className="text-purple-400 hover:text-purple-200">
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Background Image */}
      <div className="relative w-full h-80 bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url(/path/to/hexagonal-background.png)' }}>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 text-center py-20">
          <h1 className="text-6xl font-bold text-white">Coding Articles</h1>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="container mx-auto py-12 px-8 sm:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-3xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.date}</p>
                <p className="text-gray-300 mb-6">{post.description}</p>
                {/* Use dynamic routing for the blog post */}
                <Link href={`/blog/${post.slug}`} className="text-green-400 hover:underline">
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
