import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../styles/CommunityNavigationHeader.scss";

const CommunityNavigationHeader: React.FC = () => {
  return (
    <nav className="nav-bar">
      <div className="shop-link-wrapper">
        <NavLink to="/Main" className="nav-link shop-link">
          Main
        </NavLink>
      </div>
    </nav>
  );
};

export default CommunityNavigationHeader;
