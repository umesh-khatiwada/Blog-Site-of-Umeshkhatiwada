// ContentRenderer.tsx
import React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { BlogData } from "@/app/types/blog";

interface ContentRendererProps {
  description: BlogData["data"]["attributes"]["description"];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ description }) => {
  return (
    <div className="prose prose-lg prose-invert max-w-none font-mono">
      <BlocksRenderer
        content={description}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 animate-fadeInRight text-gray-300">
              {children}
            </p>
          ),
          heading: ({ children, level }) => {
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag className="font-bold mt-6 mb-4 text-green-400 animate-fadeInLeft">
                {children}
              </HeadingTag>
            );
          },
          list: ({ children, format }) => {
            const ListTag = format === "ordered" ? "ol" : "ul";
            return (
              <ListTag className="list-inside mb-4 pl-4 animate-fadeInRight text-gray-300">
                {children}
              </ListTag>
            );
          },
          "list-item": ({ children }) => (
            <li className="mb-2 animate-fadeInRight">{children}</li>
          ),
          link: ({ children, url }) => (
            <a
              href={url}
              className="text-blue-400 hover:underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-green-500 pl-4 py-2 italic mb-4 bg-gray-800 rounded-r animate-fadeInScale text-gray-300">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <pre className="bg-black p-4 rounded-md overflow-x-auto mb-4 animate-fadeInScale">
              <code className="text-sm text-green-400">{children}</code>
            </pre>
          ),
          image: ({ image }) => (
            <figure className="mb-4 animate-fadeInScale">
              <Image
                src={image.url}
                alt={image.alternativeText || ""}
                width={800}
                height={600}
                className="rounded-lg shadow-lg border border-green-500"
              />
              {image.caption && (
                <figcaption className="text-center text-gray-400 mt-2">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ),
        }}
      />
    </div>
  );
};

export default ContentRenderer;
