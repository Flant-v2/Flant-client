import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { communityApi, authApi } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.scss";
import CommunityList from "../components/CommunityList";

interface MainPage {
  isLoggedIn: boolean;
}

interface Community {
  communityId: number;
  communityName: string;
  communityLogoImage: string | null;
  communityCoverImage: string | null;
}

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const MainPage: React.FC<MainPage> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [mycommunities, setMyCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      navigate("/main");
      window.location.reload(); // 상태 갱신을 위해 페이지 리로드
    } catch (error) {
      alert("LogOut failed.");
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          const response = await communityApi.findAll();
          setCommunities(response.data.data);
        } else {
          const response = await communityApi.findAll();
          const myresponse = await communityApi.findMy();

          setCommunities(response.data.data);
          setMyCommunities(myresponse.data.data);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch communities");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunities();
  }, []);
  // 새로고침 핸들러
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 기본 링크 동작 방지
    window.location.reload(); // 페이지 새로고침
  };
  const handleCommunityClick = (communityId: number) => {
    navigate(`/communities/${communityId}/feed`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-page">
      <header>
        <div className="header-box">
          <Link
            to="/main"
            className="header-box-logo"
            onClick={handleLogoClick}
          >
            <img
              className="header-box-logo-image"
              src="/favicon.ico"
              alt="logo"
            />
          </Link>
          <div className="header-box-blank"></div>
          <div className="header-box-user">
            {isLoggedIn ? (
              <div className="header-box-user-info">
                {/* <button>
                  <img
                    className="header-notification-icon"
                    src="/images/notification.png"
                    alt="notification"
                  />
                </button> */}
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
      <div className="mainPage-main">
        {isLoggedIn && (
          <div className="mainPage-main-my">
            {mycommunities.length > 0 ? (
              <CommunityList
                title="나의 커뮤니티"
                communities={mycommunities}
                onCommunityClick={handleCommunityClick}
              />
            ) : (
              <div className="no-communities">가입해줘</div>
            )}
          </div>
        )}

        <div className="mainPage-main-all">
          <CommunityList
            title="모든 커뮤니티"
            communities={communities}
            onCommunityClick={handleCommunityClick}
          />
        </div>
      </div>
      <footer></footer>
    </div>
  );
};

export default MainPage;
