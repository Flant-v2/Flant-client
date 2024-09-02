import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { liveApi, authApi, communityApi } from "../services/api";
import Header from "../components/communityBoard/Header";
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";
import "./liveListPage.scss";

interface Live {
  liveId: number;
  title: string;
  artistId: string;
  thumbnailImage: string;
  liveVideoUrl: string;
}

const LiveListPage: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [community, setCommunity] = useState<any>(null);

  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();

  useEffect(() => {
    console.log(communityId);
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        // 여기에 필요한 다른 초기화 작업을 추가하세요.
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await communityApi.findOne(Number(communityId)); // communityId로 커뮤니티 정보 가져오기
        setCommunity(response.data.data); // 커뮤니티 정보를 상태로 설정
      } catch (error) {
        console.error("Error fetching community data:", error);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await liveApi.findLives(Number(communityId));
        setLives(response.data.data);
      } catch (error) {
        console.error("Error fetching lives data:", error);
      }
    };

    fetchLiveData();
  }, [communityId]);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      setIsLoggedIn(false);
      navigate("/main");
      window.location.reload();
    } catch (error) {
      alert("로그아웃 실패.");
    }
  };

  const handleLiveClick = (liveId: number) => {
    const selectedLive = lives.find((live) => live.liveId == liveId);
    if (!selectedLive?.liveVideoUrl) {
      navigate(`/communities/${communityId}/live/${liveId}`);
    } else {
      navigate(`/communities/${communityId}/live/${liveId}/recordings`);
    }
  };

  return (
    <div className="media-container">
      {community && (
        <>
          <Header
            communityName={community.communityName}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
          <CommunityNavigationHeader />
        </>
      )}
      <div className="media-grid">
        {lives.map((item) => (
          <div
            key={item.liveId}
            className="media-item"
            onClick={() => handleLiveClick(item.liveId)}
          >
            {item.thumbnailImage ? (
              <img src={item.thumbnailImage} alt={item.title} />
            ) : (
              <div className="no-thumbnail">No Thumbnail</div>
            )}
            <div className="live-title">
              {!(item.liveVideoUrl) && (
                <img
                  src="https://png.pngtree.com/png-clipart/20220602/original/pngtree-icon-live-streaming-vector-png-image_7885118.png"
                  alt="Live Indicator"
                  className="live-indicator" // 추가된 부분
                />
              )}
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveListPage;
