/* eslint-disable @typescript-eslint/no-explicit-any */

interface ImageFormats {
  thumbnail: { url: string };
  medium?: { url: string };
  small?: { url: string };
  large?: { url: string };
}

interface BlogPostImage {
  data: {
    attributes: {
      formats: ImageFormats;
    };
  } | null;
}

interface BlogPostAttributes {
  Title: string;
  Date: string;
  updatedAt: string;
  slug: string;
  img: BlogPostImage;
  shortDescription: string;
}

export interface BlogPost {
  id: number;
  attributes: BlogPostAttributes;
}

  
  export interface ImageAttributes {
    name: string;
    formats: ImageFormats;
    url: string;
  }
  
  export interface SuggestedArticle {
    id: number;
    title: string;
    excerpt: string;
    imageUrl: string;
  }

  interface comments {
    id: string;
    data: any;
    attributes: {
      Name: string;
      Email: string;
      comment: string;
      createdAt: string;
    };
  }
  export interface BlogAttributes {
    Title: string;
    publishedAt: string;
    description: any;
    viewCount: number;
    shortDescription: string;
    comments: comments;
    data: any;
    img?: {
      data: {
        attributes: ImageAttributes;
      };
    };
  }
  
  export interface BlogData {
    data: {
      id: number;
      attributes: BlogAttributes;
    };
  }

export  interface SuggestedArticle {
    id: number;
    attributes: {
      publishedAt: string | number | Date;
      Title: string;
      slug: string;
      viewCount: number;
      shortDescription: string;
      img: {
        data: {
          attributes: {
            url: string;
            name: string;
          };
        };
      };
    };
  }
  
  export interface SuggestedArticlesProps {
    suggestedArticles: SuggestedArticle[];
  }
  

  
  

  