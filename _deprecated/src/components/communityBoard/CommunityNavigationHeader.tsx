import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import "../../styles/CommunityNavigationHeader.scss"
import { liveApi } from '../../services/api';
interface Live {
  id: number;
  title: string;
  artistId: string;
  // 기타 필요한 필드들...
}
const CommunityNavigationHeader: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const { communityId } = useParams<{ communityId: string }>();
  useEffect(() => {
    const fetchLives = async () => {
      if (!communityId) {
        throw new Error('communityId가 제공되지 않았습니다.');
      }
      try {
        // TODO : 추후 기능 추가
        // const response = await liveApi.findAllLives(communityId);
        // setLives(response.data.data);
      } catch (error) {
        console.error('라이브 목록을 가져오는데 실패했습니다:', error);
      }
    };
    fetchLives();
  }, [communityId]);
  const liveLink = lives.length > 0 ? `/live/${lives[0].id}` : "/live";
  return (
    <nav className="nav-bar">
      <NavLink to={`/communities/${communityId}/feed`} className="nav-link">
        <span className="nav-tab">Feed</span>
      </NavLink>
      <NavLink to={`/communities/${communityId}/artists`} className="nav-link">
        <span className="nav-tab">Artist</span>
      </NavLink>
      <NavLink to={`/communities/${communityId}/media`} className="nav-link">
        <span className="nav-tab">Media</span>
      </NavLink>
      <NavLink to={`/communities/${communityId}/live`} className="nav-link">
        <span className="nav-tab">LIVE</span>
      </NavLink>
      <div className="shop-link-wrapper">
        <NavLink to={`/communities/${communityId}/merchandise`} className="nav-link shop-link">
          Shop
        </NavLink>
      </div>
    </nav>
  );
};
export default CommunityNavigationHeader;