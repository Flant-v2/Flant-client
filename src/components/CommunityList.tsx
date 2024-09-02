import React from "react";
import "./../styles/CommunityList.scss";

interface Community {
  communityId: number;
  communityName: string;
  communityLogoImage: string | null;
  communityCoverImage: string | null;
}

interface CommunityListProps {
  title: string;
  communities: Community[];
  onCommunityClick: (communityId: number) => void;
}

const CommunityList: React.FC<CommunityListProps> = ({
  title,
  communities,
  onCommunityClick,
}) => {
  return (
    <div className="community-list">
      <h1 className="community-list-title">{title}</h1>
      {communities.map(community => (
        <div
          key={community.communityId}
          className="figure community-card-box"
          onClick={() => onCommunityClick(community.communityId)}
        >
          <div className="community-card-cover-wrap">
            <img
              className="community-card-cover-img"
              src={
                community.communityCoverImage ||
                "https://picsum.photos/id/475/250/300"
              }
              alt="커버 이미지"
            />
          </div>
          <div className="community-card-logo-wrap">
            <img
              className="community-card-logo-img"
              src={
                community.communityLogoImage ||
                "https://picsum.photos/id/476/43/43"
              }
              alt="로고 이미지"
            />
          </div>
          <div className="community-card-caption new-amsterdam-regular">
            {community.communityName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
