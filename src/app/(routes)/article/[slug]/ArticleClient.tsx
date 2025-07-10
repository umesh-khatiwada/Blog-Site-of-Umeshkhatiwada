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
  const [comments, setComments] = useState<Comment[]>(() => {
    // Handle different response structures for initial comments
    const articleData = Array.isArray(initialData.data) ? initialData.data[0] : initialData.data
    return articleData?.comments || []
  })
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
    // Handle different response structures
    const articleData = Array.isArray(data.data) ? data.data[0] : data.data
    
    setComments(articleData.comments || [])
    if (articleData.categories && articleData.categories.length > 0) {
      setCategoryId(articleData.categories[0].documentId)
      console.log(articleData.categories[0].documentId)
    }
    if (data.viewCount !== undefined) {
      viewCounter(id, data.viewCount)
    }
  }, [id, data, setCategoryId])

  const handleCommentSubmit = () => {
    // Handle different response structures for fetching comments
    const documentId = Array.isArray(initialData.data) ? initialData.data[0].documentId : initialData.data.documentId
    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/${documentId}?populate=*`)
      .then((res) => res.json())
      .then((newData) => {
        const articleData = Array.isArray(newData.data) ? newData.data[0] : newData.data
        setComments(articleData.comments || [])
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

    // Handle different response structures - data could be an array or direct object
    const articleData = Array.isArray(data.data) ? data.data[0] : data.data
    
    // Check if articleData exists
    if (!articleData) {
      return (
        <div className="medium-error">
          <FaServer className="medium-error-icon" />
          <h2 className="medium-error-title">Article Not Found</h2>
          <p className="medium-error-message">The requested article could not be found or may have been removed.</p>
        </div>
      )
    }
    
    const { Title, publishedAt, img, description, description_2, pdf_files } = articleData
    const imageUrl = img && img.length > 0 ? img[0]?.url : null
    
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
            {description_2 && description_2.length > 0 ? (
              <ContentRendererDesc description_2={description_2} />
            ) : description ? (
              <ContentRenderer description={description} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No content available for this article.</p>
            )}
          </div>
        </div>

        {/* PDF Preview Section - Only show if PDF exists */}
        {hasPdfFile && (
          <div className="mt-6">
            {/* Full Screen Button positioned top-right */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => {
                  // Create a full-screen modal
                  const modal = document.createElement('div');
                  modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
                  modal.innerHTML = `
                    <div class="relative w-full h-full max-w-6xl">
                      <button class="absolute top-4 right-4 z-10 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <iframe 
                          src="${pdf_files}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH" 
                          class="w-full h-full border-0 rounded-lg"
                          title="PDF Full Screen Preview"
                        ></iframe>
                      </div>
                    `;
                    document.body.appendChild(modal);
                    
                    // Close on escape key
                    const handleEscape = (e: KeyboardEvent) => {
                      if (e.key === 'Escape') {
                        modal.remove();
                        document.removeEventListener('keydown', handleEscape);
                      }
                    };
                    document.addEventListener('keydown', handleEscape);
                    
                    // Close on background click
                    modal.addEventListener('click', (e) => {
                      if (e.target === modal) {
                        modal.remove();
                        document.removeEventListener('keydown', handleEscape);
                      }
                    });
                  }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                title="View PDF in fullscreen"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* PDF Embedded Preview - minimal styling */}
            <div className="relative w-full h-96 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600 overflow-hidden">
              <iframe 
                src={`${pdf_files}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH`}
                className="w-full h-full border-0"
                title="PDF Document Preview"
              />
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
        <div className="medium-article-responses">        <MemoizedCommentsSection
          comments={comments}
          blogId={(Array.isArray(data.data) ? data.data[0]?.documentId : data.data?.documentId) || ''}
          onCommentSubmit={handleCommentSubmit}
        />
        <div className="medium-share-section">
          <SocialSharing
            shareUrl={typeof window !== "undefined" ? window.location.href : ""}
            title={(Array.isArray(data.data) ? data.data[0]?.Title : data.data?.Title) || ""}
            description={(Array.isArray(data.data) ? data.data[0]?.description : data.data?.description) || ""}
          />
        </div>
        </div>
      </div>
    </div>
  )
}

ArticleClient.displayName = 'ArticleClient'

export default ArticleClient