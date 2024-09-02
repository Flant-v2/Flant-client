import React, { useState } from "react";
import { Comment } from "./types";
import "../../styles/PostCard.scss";

interface CommentItemProps extends Comment {
  onReply: (commentId: number, comment: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ commentId, author, comment, createdAt, profileImage, onReply }) => {
  const [replyContent, setReplyContent] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent("");
    }
  };

  return (
    <div className="artist-comment-item">
      <div className="artist-comment-header">
        <img
          src={profileImage || "/default-profile.png"}
          alt={author}
          className="author-image"
          onError={(e) => {
            e.currentTarget.src = "/default-profile.png";
          }}
        />
        <strong className="artist-name"> {author}</strong>
        <span className="comment-time">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <p className="artist-comment-content">{comment}</p>
      {/* <button onClick={() => setReplyContent("답글")} className="reply-button">
        답글
      </button>
      {replyContent && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요..."
          />
          <button type="submit">답글 작성</button>
        </form>
      )} */}
    </div>
  );
};

export default CommentItem;
