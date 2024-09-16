/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface BlogPost {
//     id: number;
//     attributes: {
//       Title: string;
//       createdAt: string;
//       updatedAt: string;
//       publishedAt: string;
//       description: any[];
//       slug: string;
//       viewCount: number;
//       img?: {
//         data?: {
//           attributes?: {
//             formats?: {
//               small?: { url: string };
//               thumbnail?: { url: string };
//             };
//           };
//         };
//       };
//       categories?: {
//         data?: Array<{
//           id: number;
//           attributes: {
//             Title: string;
//           };
//         }>;
//       };
//     };
//   }
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


  // export interface ImageFormats {
  //   thumbnail: { url: string };
  //   medium: { url: string };
  //   small: { url: string };
  //   large: { url: string };
  // }
  
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
    viewCount: number;
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
  

  
  

  