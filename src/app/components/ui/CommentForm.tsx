import React from "react";
import { NewComment } from "@/app/types/blog";

interface CommentFormProps {
  newComment: NewComment;
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ newComment, setNewComment, handleCommentSubmit }) => {
  return (
    <section className="mt-8">
      <h3 className="text-2xl text-green-400 mb-4 font-mono">Push a Log</h3>
      <form onSubmit={handleCommentSubmit} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-green-500">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2 font-mono">Name</label>
          <input
            type="text"
            id="name"
            value={newComment.Name}
            onChange={(e) => setNewComment({ ...newComment, Name: e.target.value })}
            className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2 font-mono">Email</label>
          <input
            type="email"
            id="email"
            value={newComment.Email}
            onChange={(e) => setNewComment({ ...newComment, Email: e.target.value })}
            className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-300 mb-2 font-mono">Log Message</label>
          <textarea
            id="comment"
            rows={4}
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            className="w-full p-2 bg-black border border-green-500 rounded text-gray-300 font-mono"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 font-mono"
        >
          Push Log
        </button>
      </form>
    </section>
  );
};

export default CommentForm;