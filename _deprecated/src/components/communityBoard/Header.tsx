import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Header.scss";

interface HeaderProps {
  communityName: string;
  isLoggedIn: boolean;
  handleLogout: (e: React.FormEvent) => void;
}

const Header: React.FC<HeaderProps> = ({
  communityName,
  isLoggedIn,
  handleLogout,
}) => {
  return (
    <header>
      <div className="header-box">
        <div className="header-box-logo-and-name">
          <Link to="/main" className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/favicon.ico"
              alt="logo"
            />
          </Link>
          <div className="header-community-name new-amsterdam-regular">
            {communityName}
          </div>
        </div>
        <div className="header-box-user">
          {isLoggedIn ? (
            <div className="header-box-user-info">
              {/* <div>
                <button>
                  <img className="header-notification-icon" src="/images/notification.png" alt="notification" />
                </button>
              </div> */}
              <div className="header-box-user-dropdown-container">
                <button>
                  <img
                    className="header-user-icon"
                    src="/images/user.png"
                    alt="user"
                  />
                </button>
                <div className="header-user-dropdown">
                  <Link to="/userinfo">내 정보</Link>
                  {/* <Link to="/membership">멤버십</Link> */}
                  <Link to="/cart">장바구니</Link>
                  {/* <Link to="/payment-history">결제내역</Link> */}
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="header-box-login">
              <div className="header-box-container">
                <Link to="/login" className="header-box-btn btn-3">
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
