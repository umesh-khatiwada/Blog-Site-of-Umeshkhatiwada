/* eslint-disable @typescript-eslint/no-explicit-any */

interface ImageFormats {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormats;
    small: ImageFormats;
    medium: ImageFormats;
    large: ImageFormats;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}


export interface NewComment {
  Name: string;
  Email: string;
  comment: string;
}

export interface Comment {
  id: number;
  documentId: string;
  Email: string;
  Name: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface SubCategory {
  id: number;
  documentId: string;
  Title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blogs: Article[]
  locale: string | null;
}

export interface Category {
  id: number;
  documentId: string;
  Title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  sub_categories: SubCategory[];
  blogs: Article[];
}

export interface Article {
  data: any;
  id: number;
  documentId: string;
  Title: string;
  description: string;
  slug: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  shortDescription: string;
  img: Image[];
  comments: Comment[];
  sub_category: SubCategory;
  categories: Category[];
  localizations: any[];
}













//   export interface ImageAttributes {
//     name: string;
//     formats: ImageFormats;
//     url: string;
//   }
  
//   export interface SuggestedArticle {
//     id: number;
//     title: string;
//     excerpt: string;
//     imageUrl: string;
//   }

//   interface comments {
//     id: string;
//     data: any;
//     attributes: {
//       Name: string;
//       Email: string;
//       comment: string;
//       createdAt: string;
//     };
//   }
//   export interface BlogAttributes {
//     createdAt: string | number | Date;
//     categories: any;
//     Title: string;
//     publishedAt: string;
//     description: any;
//     description_md: any;
//     viewCount: number;
//     shortDescription: string;
//     comments: comments;
//     data: any;
//     img?: {
//       data: {
//         attributes: ImageAttributes;
//       };
//     };
//   }
  
//   export interface BlogData {
//     data: {
//       id: number;
//       attributes: BlogAttributes;
//     };
//   }

// export  interface SuggestedArticle {
//     id: number;
//     attributes: {
//       publishedAt: string | number | Date;
//       Title: string;
//       slug: string;
//       viewCount: number;
//       shortDescription: string;
//       img: {
//         data: {
//           attributes: {
//             url: string;
//             name: string;
//           };
//         };
//       };
//     };
//   }
  
//   export interface SuggestedArticlesProps {
//     suggestedArticles: SuggestedArticle[];
//   }
  



// // Define types for comments
// export interface Comment {
//   id: number;
//   attributes: {
//     Name: string;
//     Email: string;
//     comment: string;
//     createdAt: string;
//   };
// }




// interface CategoryAttributes {
//   Title: string;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
//   sub_categories: {
//     data: SubCategory[];
//   };
// }

// export interface CategoryFull {
//   attributes(attributes: any): unknown;
//   data: {
//     id: number;
//     attributes: CategoryAttributes;
//   };
//   meta: Record<string, any>;
// }

// export interface FullCategories {
//   attributes: any;
//   Title: string;
//   sub_categories: {
//     data: Category[];
//   };
// }



// interface ImageData {
//   id: number;
//   attributes: {
//     url: string;
//   };
// }

// // Interface for image
// interface Image {
//   data: ImageData;
// }


// // Interface for blog attributes
// export interface BlogAttributess {
//   slug: string;
//   publishedAt: string;
//   img: Image;
// }

// // Interface for individual blog data
// export interface BlogDataa {
//   id: number;
//   attributes: BlogAttributess;
// }

// // Interface for pagination metadata
// interface PaginationMeta {
//   page: number;
//   pageSize: number;
//   pageCount: number;
//   total: number;
// }

// // Interface for the API response
// export interface BlogApiResponses {
//   data: BlogDataa[];
//   meta: {
//     pagination: PaginationMeta;
//   };
// }



//////////////////////////

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
