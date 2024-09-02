import React from "react";
import CommentItem from "./CommentItem";
import { Comment } from "./types";
import "../../styles/CommentList.scss";

interface CommentListProps {
  comments: Comment[];
  userId: number | null; // 현재 로그인한 사용자의 ID
  onReply: (commentId: number, comment: string) => void;
  onEdit: (commentId: number, updatedComment: string, communityId: number, artistId?: number) => void; // artistId를 선택적으로 받음
  onDelete: (commentId: number) => void; // 댓글 삭제 핸들러
  currentUserCommunityUserId: number | null; // 추가된 부분
  communityUserId: number;
}

const CommentList: React.FC<CommentListProps> = ({ userId, comments, onReply, onEdit, onDelete }) => {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          {...comment}
          userId={userId}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
