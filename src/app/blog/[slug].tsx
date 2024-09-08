import { useRouter } from 'next/router';

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Dummy blog posts data to fetch post by slug
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

  // Find the blog post that matches the slug
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="container mx-auto px-8 sm:px-16 lg:px-32">
        <h1 className="text-5xl font-bold text-center mb-12">{post.title}</h1>
        <p className="text-gray-500 text-sm mb-8">{post.date}</p>
        <div className="text-gray-700 text-lg">{post.content}</div>
      </div>
    </div>
  );
};

export default BlogPost;
