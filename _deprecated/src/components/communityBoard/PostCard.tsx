import React, { useEffect, useState } from "react";
import { Post } from "./types";
import CommentItem from "./CommentItem";
import "../../styles/PostCard.scss";
import { commentApi, userApi } from "../../services/api";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ArtistCommentItem from "./ArtistCommentItem";

interface PostCardProps extends Post {
  onLike: (postId: number, likeStatus: boolean) => void;
  onComment: (postId: number, comment: string, communityId: number, artistId?: number, imageUrl?: string) => void;
  onReply: (commentId: number, content: string) => void;
  artistId?: number; // PostCard에 artistId를 선택적으로 전달
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  nickname,
  content,
  profileImage,
  postImages = [],
  likes,
  comments = [],
  createdAt,
  isLiked,
  onLike,
  onComment,
  onReply,
  artistId, // artistId를 받아옴
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showAllCommentsPopup, setShowAllCommentsPopup] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const [artistsCommentsList, setArtistsCommentsList] = useState(comments);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);
  const [currentUserCommunityUserId, setCurrentUserCommunityUserId] = useState<number | null>(null);
  const { communityId } = useParams<{ communityId: string }>();
  const [userId, setUserId] = useState<number | null>(null); // 단일 유저 ID 상태 추가

  const handleLike = () => {
    onLike(postId, !isLiked);
  };

  const fetchUser = async () => {
    try {
      const response = await userApi.findMy();
      const userData = response.data.data;
      if (userData && userData.id) {
        setUserId(userData.id);
      } else {
        console.error("User data is invalid:", userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (popupPostId !== null) {
      const fetchComments = async () => {
        try {
          const response = await commentApi.getComments(popupPostId, false);
          setCommentsList(response.data);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };
      fetchComments();
    }
  }, [popupPostId]);

  const openAllCommentsPopup = async () => {
    setPopupPostId(postId); // postId를 상태에 저장

    setShowAllCommentsPopup(true);
    const updatedArtistComments = await commentApi.getComments(postId!, true);
    setArtistsCommentsList(updatedArtistComments.data);
    const updatedComments = await commentApi.getComments(postId!, false);
    setCommentsList(updatedComments.data);
  };

  const closeAllCommentsPopup = () => {
    setShowAllCommentsPopup(false);
    setPopupPostId(null); // 팝업을 닫을 때 postId 초기화
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        await commentApi.create({
          postId: popupPostId!, // 팝업에서 사용될 postId로 댓글 생성
          comment: newComment,
          communityId: Number(communityId),
          artistId: Number(artistId),
          // imageUrl,
        });
        if (artistId) {
          artistId; // artistId가 있을 경우에만 추가
        }

        setNewComment("");
        const updatedComments = await commentApi.getComments(popupPostId!, false);
        setCommentsList(updatedComments.data);
      } catch (error) {
        console.error("댓글 작성 실패:", error);
      }
    }
  };

  const handleEditComment = async (commentId: number, updatedComment: string) => {
    const numericArtistId = artistId ? Number(artistId) : undefined;

    try {
      await commentApi.patchComment(commentId, {
        comment: updatedComment,
        isArtist: numericArtistId,
      });
      const updatedComments = await commentApi.getComments(popupPostId!);
      setCommentsList(updatedComments.data);
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setCommentsList((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const loadMoreComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const response = await commentApi.getComments(popupPostId!, false);
      const newComments = response.data;

      if (newComments.length > 0) {
        setCommentsList((prevComments) => [...prevComments, ...newComments]);
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error("Failed to load more comments", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}. ${date.getDate().toString().padStart(2, "0")}. ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const getImageLayout = () => {
    if (postImages.length === 1) {
      return "single";
    } else if (postImages.length === 2) {
      return "two";
    } else if (postImages.length === 3) {
      return "three";
    } else {
      return "none";
    }
  };

  const imageLayout = getImageLayout();

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="author-info">
          <img
            src={profileImage || "/default-profile.png"}
            alt={nickname}
            className="author-image"
            onError={(e) => {
              e.currentTarget.src = "/default-profile.png";
            }}
          />
          <div className="author-details">
            <h3>{nickname}</h3>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
      <p className="post-content">{content}</p>
      {imageLayout === "single" && postImages.length > 0 && (
        <div className="post-images single">
          <img src={postImages[0].postImageUrl} alt="Post" />
        </div>
      )}
      {imageLayout === "two" && postImages.length > 0 && (
        <div className="post-images two">
          {postImages.map((image) => (
            <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
          ))}
        </div>
      )}
      {imageLayout === "three" && postImages.length > 0 && (
        <div className="post-images three">
          <div className="left-image">
            <img src={postImages[0].postImageUrl} alt="Post" />
          </div>
          <div className="right-images">
            {postImages.slice(1).map((image) => (
              <img key={image.postImageId} src={image.postImageUrl} alt="Post" />
            ))}
          </div>
        </div>
      )}
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? "liked" : ""}>
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <span>{likes}</span> {/* 좋아요 수 표시 */}
        <button onClick={openAllCommentsPopup}>
          <span className="material-symbols-outlined">comment</span>
        </button>
      </div>
      {showComments && (
        <div className="comments-section">
          {commentsList.length > 0
            ? commentsList.map((comment) => {
                return (
                  <CommentItem
                    key={comment.commentId}
                    {...comment}
                    userId={userId}
                    commentId={comment.commentId}
                    onReply={onReply}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                );
              })
            : !loadingComments && <p>댓글이 존재하지 않습니다.</p>}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              id="commentInput"
            />
            <button type="submit">댓글 작성</button>
          </form>
        </div>
      )}
      {showAllCommentsPopup && (
        <div className="comments-popup-overlay">
          <div className="comments-popup">
            <div className="popup-header">
              <button onClick={closeAllCommentsPopup}>X</button>
            </div>
            <div className="popup-content">
              <div className="post-content-left">
                <h3>게시글 내용</h3>
                <p>{content}</p>
                {postImages.length > 0 &&
                  postImages.map((image) => <img key={image.postImageId} src={image.postImageUrl} alt="Post" />)}
              </div>
              <div className="comments-content-right">
                <h3>댓글</h3>
                <InfiniteScroll
                  dataLength={commentsList.length}
                  next={loadMoreComments}
                  hasMore={hasMoreComments}
                  loader={loadingComments && <p>Loading...</p>}
                  endMessage={!hasMoreComments && <p>No more comments</p>}
                >
                  <div className="artist-comments">
                    {commentsList.length > 0
                      ? artistsCommentsList.map((comment) => (
                          <ArtistCommentItem key={comment.commentId} {...comment} onReply={onReply} />
                        ))
                      : !loadingComments && <p></p>}
                  </div>
                  {commentsList.length > 0
                    ? commentsList.map((comment) => {
                        return (
                          <CommentItem
                            key={comment.commentId}
                            {...comment}
                            userId={userId}
                            commentId={comment.commentId}
                            onReply={onReply}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                          />
                        );
                      })
                    : !loadingComments && <p>댓글이 존재하지 않습니다.</p>}
                </InfiniteScroll>
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성하세요..."
                    className="comment-input"
                    id="popupCommentInput"
                  />
                  <button type="submit" className="submit-btn">
                    등록
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
