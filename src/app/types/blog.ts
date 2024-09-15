/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BlogPost {
    id: number;
    attributes: {
      Title: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      description: any[];
      slug: string;
      img?: {
        data?: {
          attributes?: {
            formats?: {
              small?: { url: string };
              thumbnail?: { url: string };
            };
          };
        };
      };
      categories?: {
        data?: Array<{
          id: number;
          attributes: {
            Title: string;
          };
        }>;
      };
    };
  }


  export interface ImageFormats {
    thumbnail: { url: string };
    medium: { url: string };
    small: { url: string };
    large: { url: string };
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
  
  export interface BlogAttributes {
    Title: string;
    publishedAt: string;
    description: any;
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


  
  

  