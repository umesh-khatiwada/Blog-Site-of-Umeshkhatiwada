// import { NewComment } from "@/app/types/blog";
// import React from "react";

// export const MemoizedCommentsSection = React.memo(({
//     comments,
//     newComment,
//     setNewComment,
//     handleCommentSubmit,
//   }: {
//     comments: Comment[];
//     newComment: NewComment;
//     setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
//     handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
//   }) => {
//     return (
//       <section className="mt-8">
//         <h2 className="text-xl font-semibold text-green-400 mb-2">Comments</h2>
//         <ul className="mb-4 space-y-3">
//           {comments.map((comm) => (
//             <li key={comm.id} className="bg-gray-800 p-3 rounded-md shadow-sm">
//               <p className="text-green-300 font-semibold text-sm">{comm.Name}</p>
//               <p className="text-gray-300 text-sm">{comm.comment}</p>
//             </li>
//           ))}
//         </ul>
  
//         <form onSubmit={handleCommentSubmit} className="space-y-3">
//           <div className="flex space-x-3">
//             <input
//               type="text"
//               value={newComment.Name}
//               onChange={(e) => setNewComment((prev) => ({ ...prev, Name: e.target.value }))}
//               placeholder="Name"
//               required
//               className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="email"
//               value={newComment.Email}
//               onChange={(e) => setNewComment((prev) => ({ ...prev, Email: e.target.value }))}
//               placeholder="Email"
//               required
//               className="flex-1 p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>
  
//           <textarea
//             value={newComment.comment}
//             onChange={(e) => setNewComment((prev) => ({ ...prev, comment: e.target.value }))}
//             placeholder="Your Comment"
//             required
//             className="w-full p-2 bg-gray-700 text-gray-300 text-sm rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
//             rows={4}
//           />
  
//           <button
//             type="submit"
//             className="w-full py-2 bg-green-500 text-white text-base font-medium rounded-md hover:bg-green-400 transition-colors"
//           >
//             Submit Comment
//           </button>
//         </form>
//       </section>
//     );
//   });
  
//   MemoizedCommentsSection.displayName = 'MemoizedCommentsSection';