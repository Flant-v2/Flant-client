// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./LoginPage.scss";
import { Link } from "react-router-dom";
interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await authApi.signIn(email, password); // axios를 사용하여 로그인 요청을 보냄
      const { accessToken, refreshToken } = token.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      alert("로그인이 정상적으로 되었습니다.");
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      navigate("/main");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 및 비밀번호 재확인 바랍니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <header>
          <img className="main-box-logo" src="/favicon.ico" alt="logo"></img>
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <div className="main-email">
              <input
                className="main-email-input"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <label className="main-email-label">email</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email main-password">
              <input
                className="main-email-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <label className="main-email-label">password</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-login-button">
              <button type="submit" className="main-login-btn login-btn-3">
                로그인
              </button>
            </div>
          </form>
          <div className="main-signup">
            <Link to="/signup" className="main-signup-a">
              회원가입 하기
            </Link>
          </div>

          <div className="main-login-forget"></div>
        </main>
        {/* <footer>
          <div className="footer-line">혹은</div>
          <div className="footer-socialLogin">
            <a href="#">
              <img
                className="login-google-image"
                src="/google-icon.png"
                alt="google"
              ></img>
            </a>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default LoginPage;
