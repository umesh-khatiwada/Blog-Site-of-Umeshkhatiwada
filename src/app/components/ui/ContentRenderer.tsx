import React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Article } from "@/app/types/blog";

interface ContentRendererProps {
  description: Article["data"]["description"];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ description}) => {
  return (
    <div className="flex justify-center">
      <div className="prose prose-lg prose-invert w-[150%] max-w-7xl font-mono px-4">
        <BlocksRenderer
          content={description}
          blocks={{
            paragraph: ({ children }) => (
              <p className="mb-6 animate-fadeInRight text-gray-300 leading-relaxed">
                {children}
              </p>
            ),
            heading: ({ children, level }) => {
              const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
              return (
                <HeadingTag className="font-bold mt-8 mb-6 text-green-400 animate-fadeInLeft">
                  {children}
                </HeadingTag>
              );
            },
            list: ({ children, format }) => {
              const ListTag = format === "ordered" ? "ol" : "ul";
              return (
                <ListTag className="list-inside mb-6 pl-6 animate-fadeInRight text-gray-300 space-y-2">
                  {children}
                </ListTag>
              );
            },
            "list-item": ({ children }) => (
              <li className="animate-fadeInRight">{children}</li>
            ),
            link: ({ children, url }) => (
              <a
                href={url}
                className="text-blue-400 hover:underline transition-colors duration-200 font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            quote: ({ children }) => (
              <blockquote className="border-l-4 border-green-500 pl-6 py-4 italic mb-6 bg-gray-800 rounded-r animate-fadeInScale text-gray-300 shadow-md">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <pre className="bg-black p-6 rounded-lg overflow-x-auto mb-6 animate-fadeInScale shadow-lg">
                <code className="text-sm text-green-400">{children}</code>
              </pre>
            ),
            image: ({ image }) => (
              <figure className="mb-8 animate-fadeInScale">
                <Image
                  src={image.url}
                  alt={image.alternativeText || ""}
                  width={1040}
                  height={780}
                  className="rounded-lg shadow-xl border-2 border-green-500"
                />
                {image.caption && (
                  <figcaption className="text-center text-white-400 mt-3 italic">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ContentRenderer;