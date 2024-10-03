'use client'
import React, { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { viewCounter } from '@/app/lib/api'
import { Article, Comment } from '@/app/types/blog'
import SocialSharing from '@/app/components/ui/SocialMedia'
import { FaTerminal, FaServer, FaEye, FaCalendarAlt } from 'react-icons/fa'
import { useCategory } from '@/app/hooks/store'
import ContentRenderer from '@/app/components/ui/ContentRenderer'
import { postComment } from './postComment'
import ContentRendererDesc from '@/app/components/ui/ContentRendererDesc'

const MemoizedCommentsSection = React.memo(
  ({
    comments,
    blogId,
    onCommentSubmit,
  }: {
    comments: Comment[]
    blogId: string
    onCommentSubmit: () => void
  }) => {
    const [isPending, startTransition] = useTransition()

    return (
      <section className="mt-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-green-400 mb-2">Comments</h2>
        <ul className="mb-4 space-y-3">
          {comments.map((comm) => (
            <li key={comm.documentId} className="bg-gray-800 p-3 rounded-md shadow-sm">
              <p className="text-green-300 font-semibold text-sm">
                {comm.Name}
              </p>
              <p className="text-gray-300 text-sm">{comm.comment}</p>
            </li>
          ))}
        </ul>

        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await postComment(formData)
              if (result.success) {
                onCommentSubmit()
              } else {
                console.error(result.error)
                // Here you could set an error state and display it to the user
              }
            })
          }}
          className="space-y-3"
        >
          <input type="hidden" name="blogId" value={blogId} />
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <textarea
            name="comment"
            placeholder="Your Comment"
            required
            className="w-full p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows={4}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 bg-green-500 text-white text-base font-medium rounded-md hover:bg-green-400 transition-colors disabled:bg-gray-400"
          >
            {isPending ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </section>
    )
  }
)
MemoizedCommentsSection.displayName = 'MemoizedCommentsSection'

interface ArticleClientProps {
  initialData: Article
}

const ArticleClient: React.FC<ArticleClientProps> = ({ initialData }) => {
 const [id,] = useState(initialData.documentId)
  const [data] = useState<Article>(initialData)
  const [loading] = useState<boolean>(false)
  const [error] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>(
    initialData.data.comments || [])
  const { setCategoryId } = useCategory()

  useEffect(() => {
    setComments(data.data[0].comments || [])
    setCategoryId(data.data[0].categories[0].documentId)
    console.log(data.data[0].categories[0].documentId)
    if (data.viewCount !== undefined) {
      viewCounter(id, data.viewCount)
    }
  }, [id, data, setCategoryId])

  const handleCommentSubmit = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs/${initialData.data[0].documentId}?populate=*`)
      .then((res) => res.json())
      .then((newData) => {
        setComments(newData.data.comments || [])
      })
      .catch(console.error)
  }

  const renderContent = React.useMemo(() => {
    if (loading) {
      return (
        <div className="text-center text-green-400 py-10 animate-pulse">
          <FaTerminal className="w-16 h-16 mx-auto mb-4" />
          <div className="bg-gray-800 h-8 mb-4 w-3/4 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-1/2 mx-auto rounded"></div>
          <div className="bg-gray-800 h-4 mb-4 w-2/3 mx-auto rounded"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center text-red-500 text-xl py-10 animate-fadeIn">
          <FaServer className="w-16 h-16 mx-auto mb-4" />
          Error: {error}
        </div>
      )
    }

    const { Title, publishedAt, img, description,description_2 } = data.data[0]
    const imageUrl = img[0].url

    return (
      <article className="text-green-400 rounded-lg p-5 animate-fadeIn">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-400 animate-fadeInDown">
            {Title}
          </h1>
          <div className="flex items-center text-white-400 text-sm space-x-6">
            <span className="flex items-center">
              <FaCalendarAlt className="w-4 h-4 mr-2" />
              {new Date(publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center">
              <FaEye className="w-4 h-4 mr-2" />
              {/* {viewCount} views */}
            </span>
          </div>
        </header>
        <div className="flex justify-center">
          {imageUrl && (
            <figure className="mb-8 animate-fadeInScale">
              <Image
                src={imageUrl}
                alt={Title}
                width={400}
                height={200}
                objectFit="cover"
                className="rounded-lg shadow-lg border border-green-500"
              />
            </figure>
          )}
        </div>
        <div className="prose prose-invert max-w-none overflow-hidden break-words">
        {description_2.length == 0 ? (
  <ContentRenderer description={description} />
) : (
   <ContentRendererDesc description_2={description_2} />
)}
  </div>
      </article>
    )
  }, [loading, error, data])

  return (
    <div className="container">
      {renderContent}
      <MemoizedCommentsSection
        comments={comments}
        blogId={data.data[0].documentId}
        onCommentSubmit={handleCommentSubmit}
      />
      <SocialSharing
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        title={data.data.Title || ""}
        description={data.data.description || ""}
      />
    </div>
  )
}

ArticleClient.displayName = 'ArticleClient'

export default ArticleClient