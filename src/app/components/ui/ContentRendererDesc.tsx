import React, { useState, useEffect } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { Article } from '@/app/types/blog';

interface ContentRendererDescProps {
  description_2: Article["data"]["description_2"];
}

const ContentRendererDesc: React.FC<ContentRendererDescProps> = ({ description_2 }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const markdownContent = description_2;
        const result = await remark()
          .use(html)
          .use(remarkGfm)
          .use(remarkMath)
          .use(rehypeKatex)
          .use(rehypeHighlight)
          .process(markdownContent);
        setContent(result.toString());
      } catch (error) {
        console.error("Error parsing markdown:", error);
      }
    };

    parseMarkdown();
  }, [description_2]);

  const SkeletonLoader = () => (
    <div className="medium-loading-article">
      <div className="medium-loading-title"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-title"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-paragraph"></div>
      <div className="medium-loading-image"></div>
    </div>
  );

  return (
    <div className="medium-content">
      {content ? (
        <div 
          className="medium-article-body prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-inherit prose-headings:mb-6 prose-headings:mt-8
                    prose-p:mb-5 prose-p:leading-relaxed
                    prose-a:text-medium-green prose-a:no-underline hover:prose-a:underline
                    prose-strong:font-bold prose-strong:text-inherit
                    prose-code:font-mono prose-code:text-sm prose-code:bg-medium-lightest-gray prose-code:p-1 prose-code:rounded
                    prose-pre:bg-medium-lightest-gray prose-pre:text-medium-black prose-pre:p-4 prose-pre:rounded
                    prose-blockquote:border-l-4 prose-blockquote:border-medium-light-gray
                    prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-medium-dark-gray
                    prose-img:w-full prose-img:rounded"
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      ) : (
        <SkeletonLoader />
      )}
    </div>
  );
};

export default ContentRendererDesc;