import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi, liveApi } from "../services/api";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./LiveRecordingsPage.scss";
import Header from "../components/communityBoard/Header2";
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";

interface LiveData {
  liveId: number;
  title: string;
  artistId: number;
  liveVideoUrl: string;
  isOnAir: boolean;
}

const LiveRecordingsPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [community, setCommunity] = useState<any>(null);
  const navigate = useNavigate();

  const { communityId, liveId } = useParams<{
    communityId: string;
    liveId: string;
  }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  // 로그인 여부 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"; // localStorage에서 로그인 여부 확인
      if (!loggedIn) {
        navigate("/login"); // 로그인하지 않았다면 로그인 페이지로 이동
      } else {
        setIsLoggedIn(true); // 로그인 상태 설정
      }
    };

    checkLoginStatus();
  }, [navigate]);

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
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
        await fetchLiveData();
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthAndFetchData();
  }, [liveId]);

  useEffect(() => {
    const initializeVideoPlayer = () => {
      if (videoRef.current && liveData?.liveVideoUrl) {
        const videoJsOptions = {
          autoplay: false,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [
            {
              src: liveData.liveVideoUrl,
              type: liveData.liveVideoUrl.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL', // 포맷에 맞는 MIME 타입
            },
          ],
        };

        if (!playerRef.current) {
          playerRef.current = videojs(videoRef.current, videoJsOptions);

          playerRef.current.on("fullscreenchange", () => {
            setIsFullscreen(playerRef.current.isFullscreen());
          });
        } else {
          playerRef.current.src({ type: liveData.liveVideoUrl.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL', src: liveData.liveVideoUrl });
        }
      }
    };

    // 비디오 요소가 렌더링된 후에 초기화하도록 타이머를 사용
    const timer = setTimeout(() => {
      initializeVideoPlayer();
    }, 100); // 100ms 후에 실행 (조정 가능)

    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [liveData]);

  const fetchLiveData = async () => {
    try {
      const response = await liveApi.findRecordings(Number(liveId));
      if (response.data.status === 200) {
        setLiveData(response.data.data);
      } else {
        console.error("라이브 데이터를 가져오는데 실패했습니다:", response.data.message);
      }
    } catch (error) {
      console.error("라이브 데이터를 가져오는데 실패했습니다:", error);
    }
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      window.location.reload();
    } catch (error) {
      alert("로그아웃 실패.");
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        playerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="live-streaming-page">
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
      <div className="main-content">
        <h2 className="live-title">
          {" "}
          {liveData?.title}
        </h2>
        <div className="video-section">
            <div className="video-container">
              <div data-vjs-player>
                <video
                  ref={videoRef}
                  className="video-js vjs-default-skin vjs-big-play-centered"
                ></video>
              </div>
              <button onClick={toggleFullscreen} className="fullscreen-button">
                {isFullscreen ? "전체화면 종료" : "전체화면"}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRecordingsPage;
