import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleClient from './ArticleClient'
import { fetchBlogDetailData } from "@/app/lib/api"
import { Article } from "@/app/types/blog"
import { useCategory } from '@/app/hooks/store'

interface PageProps {
  params: { slug: string }
}

async function getArticle(slug: string): Promise<Article> {
  try {
    const article = await fetchBlogDetailData(slug)
    
    return article
  } catch (error) {
    notFound()
  }
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 
  const article = await getArticle(params.slug)
  console.log('Params:', article)
  
  return {
    title: article.data.Title,
    description: article.data.description,
    openGraph: {
      title: article.data.Title,
      description: article.data.description,
      images: article.data[0].img[0]?.url,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const article = await getArticle(params.slug)
  
  return <ArticleClient initialData={article} />
}