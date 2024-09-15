import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { useChatContext } from '../context/ChatContext';
import RoomSelector from './RoomSelector';
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { X, PaperclipIcon, SendIcon } from 'lucide-react';

interface ChatMessage {
  roomId: string;
  userId: string;
  message: string;
  timestamp: Date;
  fileUrl?: string;
  type?: 'message' | 'notification';
}

interface Community {
  communityId: number;
  communityName: string;
}

interface ChatWindowProps {
  socket: Socket | null;
  userId: string | null;
  communities: Community[];
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ socket, userId, communities, onClose }) => {
  const { messages, addMessage } = useChatContext();
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  const joinRoom = (communityId: number) => {
    if (!socket || !userId) return;

    const newRoomId = `community_${communityId}`;
    setRoomId(newRoomId);
    setSelectedCommunity(communityId);
    socket.emit('joinRoom', { roomId: newRoomId, userId });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !socket || !roomId || !userId) return;

    const payload: ChatMessage = {
      roomId,
      userId,
      message: inputMessage,
      timestamp: new Date(),
    };
    socket.emit('msgToServer', payload, (error: any) => {
      if (error) {
        console.error('Failed to send message:', error);
      } else {
        setInputMessage('');
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>채팅</h3>
        <button onClick={onClose}><X /></button>
      </div>
      {!selectedCommunity ? (
        <RoomSelector communities={communities} onSelectRoom={joinRoom} />
      ) : (
        <>
          <ScrollArea className="chat-messages">
            {messages
              .filter(msg => msg.roomId === roomId)
              .map((msg, index) => (
                <div key={index} className={`message ${msg.userId === userId ? 'outgoing' : 'incoming'}`}>
                  <strong>{msg.userId}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
          </ScrollArea>
          <div className="chat-input">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSendMessage}>
              <SendIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
