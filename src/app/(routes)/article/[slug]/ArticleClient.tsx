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

    const { Title, publishedAt, img, description, description_2, pdf_files } = data.data[0]
    const imageUrl = img[0]?.url
    
    // Handle PDF file scenarios
    const hasPdfFile = pdf_files && pdf_files !== null && pdf_files.trim() !== ''

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
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {description_2.length == 0 ? (
              <ContentRenderer description={description} />
            ) : (
              <ContentRendererDesc description_2={description_2} />
            )}
          </div>
        </div>

        {/* PDF Preview Section */}
        {hasPdfFile ? (
          <div className="medium-pdf-section mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              PDF Document Available
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={pdf_files}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF
                </a>
                <button
                  onClick={() => window.open(pdf_files, '_blank')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Preview PDF
                </button>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <iframe
                  src={pdf_files}
                  className="w-full h-96 border-0"
                  title="PDF Preview"
                  onError={(e) => {
                    const iframe = e.currentTarget;
                    iframe.style.display = 'none';
                    const errorDiv = iframe.nextElementSibling as HTMLElement;
                    if (errorDiv) errorDiv.style.display = 'block';
                  }}
                />
                <div className="hidden p-8 text-center text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 10a1 1 0 11-2 0V9a1 1 0 112 0v5zm-1-7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-lg font-medium mb-2">PDF Preview Not Available</h4>
                  <p className="text-sm">The PDF cannot be previewed in the browser. Please download to view the file.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="medium-pdf-section mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 10a1 1 0 11-2 0V9a1 1 0 112 0v5zm-1-7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              PDF Document
            </h3>
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              <h4 className="text-lg font-medium mb-2">No PDF Available</h4>
              <p className="text-sm">No PDF document is associated with this article.</p>
            </div>
          </div>
        )}
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