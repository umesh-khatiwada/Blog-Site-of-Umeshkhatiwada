// import { SuggestedArticlesProps } from "@/app/types/blog";
// import Image from 'next/image';


// /* eslint-disable react/jsx-no-undef */
// const SuggestedArticles: React.FC<SuggestedArticlesProps> = ({ suggestedArticles }) => {
//     return (
//       <aside className="lg:w-1/3 mt-8 lg:mt-0">
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeInRight">
//           <h2 className="text-2xl font-bold mb-4 text-green-400">Suggested Articles</h2>
//           {suggestedArticles.map((article) => (
//             <div key={article.id} className="mb-4 pb-4 border-b border-gray-700 last:border-b-0">
//               <div className="flex items-center">
//                 <Image
//                   src={article.attributes.img.data.attributes.url}
//                   alt={article.attributes.img.data.attributes.name}
//                   width={64}
//                   height={64}
//                   className="w-16 h-16 object-cover rounded mr-4"
//                   loading="lazy"
//                 />
//                 <div>
//                   <h3 className="font-semibold text-lg text-green-300">{article.attributes.Title}</h3>
//                   <p className="text-gray-400 text-sm">Views: {article.attributes.viewCount}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>
//     );
//   };
  
//   export default SuggestedArticles;