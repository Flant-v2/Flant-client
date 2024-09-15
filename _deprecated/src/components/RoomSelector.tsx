import React from 'react';

interface Community {
  communityId: number;
  communityName: string;
}

interface RoomSelectorProps {
  communities: Community[];
  onSelectRoom: (communityId: number) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ communities, onSelectRoom }) => {
  return (
    <div className="room-selector">
      <h4>채팅방 선택</h4>
      <ul>
        {communities.map((community) => (
          <li key={community.communityId}>
            <button onClick={() => onSelectRoom(community.communityId)}>
              {community.communityName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomSelector;
