import React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Article } from "@/app/types/blog";

interface ContentRendererProps {
  description: Article["data"]["description"];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ description}) => {
  return (
    <div className="medium-content">
      <BlocksRenderer
        content={description}
        blocks={{
          paragraph: ({ children }) => (
            <p className="medium-paragraph">
              {children}
            </p>
          ),
          heading: ({ children, level }) => {
            const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag className={`medium-heading-${level}`}>
                {children}
              </HeadingTag>
            );
          },
          list: ({ children, format }) => {
            const ListTag = format === "ordered" ? "ol" : "ul";
            return (
              <ListTag className={`medium-${format === "ordered" ? "ordered" : "unordered"}-list`}>
                {children}
              </ListTag>
            );
          },
          "list-item": ({ children }) => (
            <li className="medium-list-item">{children}</li>
          ),
          link: ({ children, url }) => (
            <a
              href={url}
              className="medium-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          quote: ({ children }) => (
            <blockquote className="medium-blockquote">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <pre className="medium-code-block">
              <code>{children}</code>
            </pre>
          ),
          image: ({ image }) => (
            <figure className="medium-figure">
              <Image
                src={image.url}
                alt={image.alternativeText || ""}
                width={700}
                height={400}
                className="medium-image"
                style={{ width: '100%', height: 'auto' }}
              />
              {image.caption && (
                <figcaption className="medium-figcaption">
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