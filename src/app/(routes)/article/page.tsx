import { Metadata } from 'next';
import { fetchBlogData } from '@/app/lib/api';
import Articles from './ArticleClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Umesh Khatiwada - DevOps Professional & Cloud Architect`,
    description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
  }
}

export default async function ArticlePage() {
  const initialData = await fetchBlogData(1);
  return <Articles initialData={initialData} />;
}