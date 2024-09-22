import { Metadata } from 'next';
import ArticleClient from './ArticleClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Umesh Khatiwada - DevOps Professional & Cloud Architect`,
    description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
  }
}

export default function ArticlePage() {
  return <ArticleClient />;
}