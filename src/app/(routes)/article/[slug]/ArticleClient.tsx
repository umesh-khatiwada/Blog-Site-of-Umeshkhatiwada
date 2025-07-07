'use client'
import React, { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { viewCounter } from '@/app/lib/api'
import { Article, Comment } from '@/app/types/blog'
import SocialSharing from '@/app/components/ui/SocialMedia'
import { FaServer } from 'react-icons/fa'
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
      <section className="medium-comments-section">
        <h2 className="medium-section-title">Responses</h2>
        
        {comments.length > 0 ? (
          <ul className="medium-comments-list">
            {comments.map((comm) => (
              <li key={comm.documentId} className="medium-comment">
                <div className="medium-comment-header">
                  <div className="medium-comment-avatar">
                    {/* Placeholder avatar with first letter of name */}
                    <div className="medium-avatar-circle">
                      {comm.Name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </div>
                  <div className="medium-comment-meta">
                    <p className="medium-comment-author">{comm.Name}</p>
                  </div>
                </div>
                <div className="medium-comment-body">
                  <p>{comm.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="medium-no-comments">
            <p>No responses yet. Be the first to respond!</p>
          </div>
        )}

        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await postComment(formData)
              if (result.success) {
                onCommentSubmit()
              } else {
                console.error(result.error)
              }
            })
          }}
          className="medium-comment-form"
        >
          <h3 className="medium-form-title">Write a response</h3>
          <input type="hidden" name="blogId" value={blogId} />
          
          <div className="medium-form-row">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="medium-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="medium-input"
            />
          </div>

          <textarea
            name="comment"
            placeholder="What are your thoughts?"
            required
            className="medium-textarea"
            rows={4}
          />

          <button
            type="submit"
            disabled={isPending}
            className="medium-button medium-button-primary"
          >
            {isPending ? 'Publishing...' : 'Publish'}
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
  const [theme, setTheme] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateTheme = () => {
        setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
      }
      updateTheme()
      const observer = new MutationObserver(updateTheme)
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
      return () => observer.disconnect()
    }
  }, [])

  useEffect(() => {
    setComments(data.data[0].comments || [])
    setCategoryId(data.data[0].categories[0].documentId)
    console.log(data.data[0].categories[0].documentId)
    if (data.viewCount !== undefined) {
      viewCounter(id, data.viewCount)
    }
  }, [id, data, setCategoryId])

  const handleCommentSubmit = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${initialData.data[0].documentId}?populate=*`)
      .then((res) => res.json())
      .then((newData) => {
        setComments(newData.data.comments || [])
      })
      .catch(console.error)
  }

  const renderContent = React.useMemo(() => {
    if (loading) {
      return (
        <div className="medium-loading-article">
          <div className="medium-loading-title"></div>
          <div className="medium-loading-meta"></div>
          <div className="medium-loading-image"></div>
          <div className="medium-loading-paragraph"></div>
          <div className="medium-loading-paragraph"></div>
          <div className="medium-loading-paragraph"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="medium-error">
          <FaServer className="medium-error-icon" />
          <h2 className="medium-error-title">Error loading article</h2>
          <p className="medium-error-message">{error}</p>
        </div>
      )
    }

    const { Title, publishedAt, img, description, description_2 } = data.data[0]
    const imageUrl = img[0].url

    return (
      <article className="medium-article">
        <header className="medium-article-header">
          <h1 className="medium-article-title-lg">
            {Title}
          </h1>
          <div className="medium-article-meta-large">
            <div className="medium-author-info">
              <div className="medium-author-avatar">
                <Image
                  src="/assets/profile.png"
                  alt="Umesh Khatiwada"
                  width={48}
                  height={48}
                  style={{ borderRadius: '50%', objectFit: 'cover', width: 48, height: 48 }}
                  priority
                />
              </div>
              <div className="medium-author-details">
                <div className="medium-author-name">Umesh Khatiwada</div>
                <div className="medium-article-date">
                  <time dateTime={new Date(publishedAt).toISOString()}>
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                  <span className="medium-dot">·</span>
                  <span className="medium-read-time">5 min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {imageUrl && (
          <figure className="medium-article-feature-image">
            <Image
              src={imageUrl}
              alt={Title}
              width={700}
              height={400}
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '500px', 
                objectFit: 'cover'
              }}
              priority
            />
          </figure>
        )}
        
        <div className="medium-article-body">
          <div className="prose-neutral dark:prose-invert max-w-none">
            {description_2.length == 0 ? (
              <ContentRenderer description={description} />
            ) : (
              <ContentRendererDesc description_2={description_2} />
            )}
          </div>
        </div>
      </article>
    )
  }, [loading, error, data])

  return (
    <div className={`medium-bg ${theme}`}>
      <div className="medium-article-container">
        {renderContent}
        <div className="medium-article-responses">
          <MemoizedCommentsSection
            comments={comments}
            blogId={data.data[0].documentId}
            onCommentSubmit={handleCommentSubmit}
          />
          <div className="medium-share-section">
            <SocialSharing
              shareUrl={typeof window !== "undefined" ? window.location.href : ""}
              title={data.data.Title || ""}
              description={data.data.description || ""}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ArticleClient.displayName = 'ArticleClient'

export default ArticleClient