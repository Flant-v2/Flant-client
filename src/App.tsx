import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import UserInfoPage from "./pages/UserInfo";
import { ChatProvider } from "./context/ChatContext";
import LiveStreamingPage from "./pages/LiveStreamingPage";
import LiveListPage from "./pages/LiveListPage";
import LiveRecordings from "./pages/LiveRecordingsPage";
import { userApi } from "./services/api";
import CommunityBoard from "./pages/CommunityBoard";
import MerchandiseList from "./pages/merchandiseList";
import MerchandiseDetail from "./pages/merchandiseDetail";
import ChatComponent from "./components/ChatComponent";
import Cart from "./pages/cart";
import ArtistPostsBoard from "./pages/ArtistPostsBoard";
import Media from "./pages/media/media";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/signup") {
        try {
          await userApi.findMy();
          setIsLoggedIn(true);
        } catch (error) {
          console.error("error", error);
          localStorage.removeItem("accessToken");
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
    children,
  }) => {
    const location = useLocation();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ChatProvider>
      <Router>
        <div className="relative min-h-screen">
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/main" replace />
                ) : (
                  <LoginPage setIsLoggedIn={setIsLoggedIn} />
                )
              }
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <MainPage isLoggedIn={isLoggedIn!} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userinfo"
              element={
                <ProtectedRoute>
                  <UserInfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <CommunityBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId/feed"
              element={
                <ProtectedRoute>
                  <CommunityBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId/artists"
              element={
                <ProtectedRoute>
                  <ArtistPostsBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId/media"
              element={
                <ProtectedRoute>
                  <Media />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId/media/:mediaId"
              element={
                <ProtectedRoute>
                  <Media />
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId/live"
              element={
                <ProtectedRoute>
                  <LiveListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="communities/:communityId/live/:liveId"
              element={
                <ProtectedRoute>
                  <LiveStreamingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="communities/:communityId/live/:liveId/recordings"
              element={
                <ProtectedRoute>
                  <LiveRecordings />
                </ProtectedRoute>
              }
            />
            <Route
              path="communities/:communityId/merchandise"
              element={
                <ProtectedRoute>
                  <MerchandiseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="communities/:communityId/merchandise/:merchandiseId"
              element={
                <ProtectedRoute>
                  <MerchandiseDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
           {/* {isLoggedIn && (
           <ChatComponent />
          )} */}
        </div>
      </Router>
    </ChatProvider>
  );
};

export default App;
