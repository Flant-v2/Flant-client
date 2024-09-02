import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { communityApi, communityUserApi, liveApi } from "../services/api";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./LiveStreamingPage.scss";
import Header from "../components/communityBoard/Header2";
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";
import io from "socket.io-client";

interface LiveData {
  liveId: number;
  title: string;
  artistId: number;
  liveHls: string;
  isOnAir: boolean;
}

const LiveStreamingPage: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [community, setCommunity] = useState<any>(null);
  const [nickName, setNickname] = useState(null);
  const navigate = useNavigate();
  const [userList, setUserList] = useState(null);

  const { communityId, liveId } = useParams<{
    communityId: string;
    liveId: string;
  }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const socketRef = useRef<any>(null); // 소켓 연결을 참조할 Ref
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 컨테이너를 참조할 Ref

  useEffect(() => {
    const fetchCommunityUserData = async () => {
      try {
        const response = await communityUserApi.findCommunityUser(
          Number(communityId)
        );
        setNickname(response.data.nickName);
      } catch (error) {
        console.error("닉네임 불러오기 실패", error);
      }
    };
    fetchCommunityUserData();
  }, [communityId]);

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
    if (liveData?.liveHls) {
      const videoJsOptions = {
        autoplay: false, // 자동 실행을 false로 설정
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: liveData.liveHls,
            type: "application/x-mpegURL",
          },
        ],
      };

      if (!playerRef.current) {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        playerRef.current = videojs(videoElement, videoJsOptions);

        playerRef.current.on("fullscreenchange", () => {
          setIsFullscreen(playerRef.current.isFullscreen());
        });
      } else {
        const player = playerRef.current;
        player.src({ type: "application/x-mpegURL", src: liveData.liveHls });
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [liveData]);

  useEffect(() => {
    // 소켓 연결 설정
    const socket = io("https://api.flant.club/api/v1/chat", {
      transports: ["websocket"],
    }); // 서버 URL 및 네임스페이스 지정
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to chat server");
      // 특정 방에 참여하기
      if (liveId) {
        socket.emit("joinRoom", { roomId: liveId, nickName });
      }
    });

    socket.on("joinedRoom", (roomId: string, userList) => {
      setUserList(userList);
      console.log(`Joined room: ${roomId}`);
    });

    socket.on(
      "receiveMessage",
      (data: { clientId: string; nickName: string; text: string }) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          `${data.nickName}: ${data.text}`,
        ]);
      }
    );

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    return () => {
      // 컴포넌트 언마운트 시 소켓 연결 해제
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [liveId]);

  useEffect(() => {
    // 채팅 메시지가 업데이트될 때마다 스크롤을 맨 아래로 이동
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (socket && message) {
      // 서버로 메시지 전송
      socket.emit("sendMessage", {
        roomId: liveId,
        nickName: nickName,
        text: message,
      });
      setMessage(""); // 메시지 입력 필드 초기화
      console.log(`sending message: ${message}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const fetchLiveData = async () => {
    try {
      const response = await liveApi.watchLive(Number(liveId));
      if (response.data.status === 200) {
        setLiveData(response.data.data);
      } else {
        console.error(
          "라이브 데이터를 가져오는데 실패했습니다:",
          response.data.message
        );
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
          {liveData && (
            <img
              src="https://png.pngtree.com/png-clipart/20220602/original/pngtree-icon-live-streaming-vector-png-image_7885118.png"
              alt="Live Indicator"
              className="live-indicator" // 추가된 부분
            />
          )}{" "}
          {liveData?.title}
        </h2>
        <div className="live-chat-section">
          <div className="video-section">
            <div className="video-container">
              {liveData?.isOnAir ? (
                <div data-vjs-player>
                  <video
                    ref={videoRef}
                    className="video-js vjs-default-skin vjs-big-play-centered"
                  ></video>
                </div>
              ) : (
                <div className="video-placeholder">
                  <p>라이브가 종료되었습니다.</p>
                </div>
              )}
              <button onClick={toggleFullscreen} className="fullscreen-button">
                {isFullscreen ? "전체화면 종료" : "전체화면"}
              </button>
            </div>
          </div>

          <div className="chat-container">
            <div className="chat-header">Chat box</div>
            <div className="chat-box">
              <div className="messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="message">
                    {msg}
                  </div>
                ))}
                <div ref={messagesEndRef} />{" "}
                {/* 스크롤을 항상 맨 아래로 유지하기 위한 참조 */}
              </div>
              {liveData?.isOnAir && (
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="채팅을 시작해보세요."
                    className="chat-input"
                  />
                  <button onClick={sendMessage} className="send-button">
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamingPage;
