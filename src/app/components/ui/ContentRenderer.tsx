import React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { BlogData } from "@/app/types/blog";
import { FaTerminal, FaCode, FaLink, FaQuoteLeft, FaList, FaListOl } from "react-icons/fa";
import { DiGit } from "react-icons/di";

interface ContentRendererProps {
  description: BlogData["data"]["attributes"]["description"];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ description }) => {
  return (
    <div className="prose prose-lg max-w-none font-mono bg-gray-900 text-green-400 p-6 rounded-lg shadow-lg">
      <BlocksRenderer
        content={description}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 animate-typewriter">
              {children}
            </p>
          ),
          heading: ({ children, level }) => {
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag className="font-bold mt-6 mb-4 text-blue-400 flex items-center">
                <FaTerminal className="mr-2" size={24} />
                {children}
              </HeadingTag>
            );
          },
          list: ({ children, format }) => {
            const ListTag = format === "ordered" ? "ol" : "ul";
            const IconComponent = format === "ordered" ? FaListOl : FaList;
            return (
              <div className="mb-4 pl-4 text-cyan-300">
                <IconComponent className="inline-block mr-2" size={18} />
                <ListTag className="list-inside inline-block">
                  {children}
                </ListTag>
              </div>
            );
          },
          "list-item": ({ children }) => (
            <li className="mb-2 flex items-start">
              <FaCode className="mr-2 mt-1 flex-shrink-0" size={18} />
              <span>{children}</span>
            </li>
          ),
          link: ({ children, url }) => (
            <a
              href={url}
              className="text-yellow-400 hover:underline transition-colors duration-200 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink className="mr-1" size={16} />
              {children}
            </a>
          ),
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 pl-4 py-2 italic mb-4 bg-gray-800 rounded-r text-purple-300 flex items-start">
              <FaQuoteLeft className="mr-2 mt-1" size={18} />
              <span>$ echo "{children}"</span>
            </blockquote>
          ),
          code: ({ children }) => (
            <pre className="bg-black p-4 rounded-md overflow-x-auto mb-4 relative">
              <div className="flex space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <code className="text-sm text-green-400">{children}</code>
            </pre>
          ),
          image: ({ image }) => (
            <figure className="mb-4">
              <div className="bg-gray-800 p-2 rounded-t-lg flex items-center">
                <DiGit className="mr-2" size={20} />
                <code className="text-xs text-green-400">
                  $ display {image.name || "image.jpg"}
                </code>
              </div>
              <Image
                src={image.url}
                alt={image.alternativeText || ""}
                width={800}
                height={600}
                className="rounded-b-lg border-2 border-gray-700"
              />
              {image.caption && (
                <figcaption className="text-center text-gray-400 mt-2 flex items-center justify-center">
                  <FaCode className="mr-2" size={16} />
                  <span># {image.caption}</span>
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