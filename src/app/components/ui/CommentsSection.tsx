import React from 'react';
import { Comment, NewComment } from '@/app/types/blog';
import CommentForm from './CommentForm';

interface CommentsSectionProps {
  comments: Comment[];
  newComment: NewComment;
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  newComment,
  setNewComment,
  handleCommentSubmit
}) => {
  return (
    <section className="mt-8">
      <h3 className="text-2xl text-green-400 mb-4 font-mono">Logs</h3>
      <div className="space-y-4 mb-8">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-green-500">
            <p className="font-bold text-green-400 font-mono">{comment.attributes.Name}</p>
            <p className="text-gray-400 text-sm font-mono">{new Date(comment.attributes.createdAt).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-300 font-mono">{comment.attributes.comment}</p>
          </div>
        ))}
      </div>
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        handleCommentSubmit={handleCommentSubmit}
      />
    </section>
  );
};

export default CommentsSection;
