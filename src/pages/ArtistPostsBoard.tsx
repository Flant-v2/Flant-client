import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApi, communityApi, postApi, commentApi, communityUserApi } from "../services/api";
import axios from "axios";
import Header from "../components/communityBoard/Header";
import PostForm from "../components/communityBoard/PostForm";
import PostCard from "./../components/communityBoard/PostCard";
import { Community, Post, CommunityUser } from "../components/communityBoard/types";
import "./board.scss";
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";

const ArtistBoard: React.FC = () => {
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityUser, setCommunityUser] = useState<CommunityUser>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommunityJoined, setIsCommunityJoined] = useState(false); // 커뮤니티 가입 여부 상태 추가
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        await fetchCommunityData();
        await fetchPosts(); // 아티스트 게시물만 가져오기
        await fetchCommunityUsers();
        await checkIfCommunityJoined(); // 커뮤니티 가입 여부 확인
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };
    checkAuthAndFetchData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      const response = await communityApi.findOne(Number(communityId));
      const communityData = response.data.data;
      setCommunity(communityData);
    } catch (error) {
      console.error("커뮤니티 데이터 가져오기 오류:", error);
    }
  };

  const fetchCommunityUsers = async () => {
    try {
      const response = await communityUserApi.findCommunityUser(Number(communityId));
      setCommunityUser(response.data);
    } catch (error) {
      console.error("커뮤니티유저 데이터 가져오기 오류:", error);
    }
  };

  const fetchMyLikePost = async (id: number) => {
    try {
      const response = await postApi.checkIfUserLikedPost(id);
      return response.data.data.status;
    } catch (error) {
      console.error("로그인 유저 정보 가져오기 오류:", error);
      return false;
    }
  };

  const fetchPosts = async () => {
    try {
      // isArtist를 true로 설정하여 아티스트 게시물만 가져오기
      const response = await postApi.getPosts(true, Number(communityId));
      const postsData = response.data.data as Post[]; // 타입 명시

      // TODO : LIKE 관련 로직 추후 리팩토링 필요
      const postsWithLikes = await Promise.all(
        postsData.map(async (post: Post) => {
          const isLiked = await fetchMyLikePost(post.postId);
          const likeCountResponse = await postApi.countLikesOnPost(post.postId); // 추가된 부분
          const likeCount = likeCountResponse.data.data.likesCount; // 좋아요 수 가져오기
          return { ...post, isLiked, likes: likeCount };
        })
      );
      setPosts(postsWithLikes);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      navigate("/main");
      window.location.reload(); // 상태 갱신을 위해 페이지 리로드
    } catch (error) {
      alert("로그아웃 실패.");
    }
  };

  function booleanToNumber(value: boolean): number {
    return value ? 1 : 0;
  }

  const handleLike = async (postId: number, likeStatus: boolean) => {
    try {
      const status = booleanToNumber(likeStatus);
      await postApi.like(postId, { status });
      setPosts(
        posts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likes: likeStatus ? post.likes + 1 : post.likes - 1,
                isLiked: likeStatus,
              }
            : post
        )
      );
      await fetchCommunityData();
    } catch (error) {
      console.error("좋아요 오류:", error);
    }
  };

  const handleComment = async (
    postId: number,
    comment: string,
    communityId: number,
    artistId?: number,
    imageUrl?: string
  ) => {
    try {
      await commentApi.create({ postId, comment, communityId });
      await fetchPosts();
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    try {
      await commentApi.createReply(commentId, { content });
      await fetchPosts();
    } catch (error) {
      console.error("답글 작성 오류:", error);
    }
  };

  // 커뮤니티 가입 여부를 확인하는 함수
  const checkIfCommunityJoined = async () => {
    try {
      const response = await communityApi.findMy();
      const myCommunity = response.data.data;
      setIsCommunityJoined(myCommunity.some((c: any) => c.communityId === Number(communityId)));
    } catch (error) {
      console.error("커뮤니티 가입 여부 확인 오류:", error);
    }
  };

  const handleJoinButtonClick = async () => {
    try {
      if (isCommunityJoined) {
        alert("이미 가입된 커뮤니티입니다.");
      } else {
        //await communityApi.joinCommunity(Number(communityId));
        alert("커뮤니티에 가입되었습니다.");
        setIsCommunityJoined(true); // 커뮤니티 가입 상태 업데이트
      }
    } catch (error) {
      console.error("가입 처리 오류:", error);
      alert("가입에 실패했습니다.");
    }
  };
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="community-board">
      {community && (
        <>
          <Header communityName={community.communityName} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <CommunityNavigationHeader />
        </>
      )}
      <main className="main-content">
        <div className="center-content">
          {isLoggedIn ? (
            <>
              {/* <PostForm onPostCreated={fetchPosts} /> */}
              <div className="posts-container">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.postId}
                      {...post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onReply={handleReply}
                    />
                  ))
                ) : (
                  <p>게시물이 없습니다.</p>
                )}
              </div>
            </>
          ) : (
            <div>
              <p>이 페이지를 보려면 로그인이 필요합니다.</p>
              <button onClick={() => navigate("/login")}>로그인 페이지로 이동</button>
            </div>
          )}
        </div>
        <div className="right-sidebar">
          <div className="right-sidebar-profile-card">
            <img
              src={community?.communityLogoImage}
              alt={community?.communityName}
              className="right-sidebar-profile-image"
            />
            <div className="right-sidebar-profile-info">
              <h2>{community?.communityName}</h2>
              {/* <p>16,692 members</p> */}
            </div>
          </div>
          <div className="right-sidebar-membership">
            {isCommunityJoined
              ? "멤버십에 가입해서 새로운 스케줄 소식을 받아보세요."
              : "커뮤니티에 가입해 소식을 받아보세요."}
            <button className="right-sidebar-join-button" onClick={handleJoinButtonClick}>
              {isCommunityJoined ? "Membership 가입하기" : "커뮤니티 가입하기"}
            </button>
          </div>
          {/* <div className="right-sidebar-dm-section">
            <button className="right-sidebar-dm-button">Weverse DM</button>
            <p>지금 DM하세요!</p>
          </div> */}
          <div className="right-sidebar-user-info">
            <p>{communityUser?.nickName}</p>
          </div>
          <div className="right-sidebar-community-notice">
            {/* <h3>커뮤니티 공지사항</h3>
            <p>[NOTICE] CHUU 2ND MINI ALBUM...</p> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistBoard;
