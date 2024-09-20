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
    categories: any;
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
  



// Define types for comments
export interface Comment {
  id: string;
  attributes: {
    Name: string;
    Email: string;
    comment: string;
    createdAt: string;
  };
}

export interface NewComment {
  Name: string;
  Email: string;
  comment: string;
}

  
interface SubCategory {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Title: string;
  };
}

interface CategoryAttributes {
  Title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  sub_categories: {
    data: SubCategory[];
  };
}

export interface CategoryFull {
  data: {
    id: number;
    attributes: CategoryAttributes;
  };
  meta: Record<string, any>;
}




// interface Blog {
//   id: string;
//   attributes: {
//     slug: string;
//     Title: string;
//     publishedAt: string | number | Date;
//   };
// }

// interface Category {
//   id: string;
//   attributes: {
//     Title: string;
//     blogs: {
//       data: Blog[];
//     };
//   };
// }

// interface FullCategories {
//   Title: string;
//   sub_categories: {
//     data: Category[];
//   };
// }
