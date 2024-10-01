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

  return (
    <div className="min-h-screen p-8 custom-scrollbar bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        {content ? (
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        ) : (
          <p className="text-xl animate-twinkle">Loading...</p>
        )}
        <button className="btn-read-more mt-4">Read More</button>
      </div>
    </div>
  );
};

export default ContentRendererDesc;