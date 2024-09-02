import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatContext } from '../context/ChatContext';
import ChatWindow from './ChatWindow';
import { jwtDecode } from "jwt-decode";
import { communityApi } from "../services/api";

import './ChatComponent.scss';

const REACT_APP_BACKEND_API_URL = 'http://localhost:3001';

interface Community {
  communityId: number;
  communityName: string;
}

const getToken = () => localStorage.getItem("accessToken");

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = (jwtDecode as any)(token);
    return decoded.sub || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const ChatComponent: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState<string | null>(null);

  const initializeSocket = useCallback(() => {
    const token = getToken();
    if (!token) return;

    const newSocket = io(REACT_APP_BACKEND_API_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('connect_error');
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userId = getUserIdFromToken(token);
      setUserId(userId);
      fetchUserCommunities(userId);
    }

    const cleanup = initializeSocket();

    return cleanup;
  }, [initializeSocket]);

  const fetchUserCommunities = async (userId: string | null) => {
    if (!userId) return;
    try {
      const response = await communityApi.findMy();
      setCommunities(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user communities:", error);
      setError('커뮤니티 정보를 가져오는데 실패했습니다.');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-container">
      {!isChatOpen && (
        <button className="chat-toggle-button" onClick={toggleChat}>
          채팅 열기
        </button>
      )}
      {isChatOpen && (
        <ChatWindow
          socket={socket}
          userId={userId}
          communities={communities}
          onClose={toggleChat}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ChatComponent;
