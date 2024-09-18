// src/pages/SignUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "./SignUpPage.scss";
import { Link } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    try {
      await authApi.signUp(name, email, password, passwordConfirm);
      alert("회원가입이 정상적으로 완료되었습니다.");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/main");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("회원가입에 실패했습니다. 입력한 정보를 확인해 주세요.");
      }
      console.error("회원가입 실패:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <header>
          <img
            className="main-box-logo"
            src="/favicon.ico"
            alt="logo"
          />
        </header>
        <main>
          <form onSubmit={handleSubmit}>
            <div className="main-email">
              <input
                className="main-email-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="main-email-label">이름</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="main-email-label">이메일</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="main-email-label">비밀번호</label>
              <span className="main-email-span"></span>
            </div>
            <div className="main-email sign-up-topmargin">
              <input
                className="main-email-input"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <label className="main-email-label">비밀번호 확인</label>
              <span className="main-email-span"></span>
            </div>

            <div className="main-login-button">
              <button type="submit" className="main-login-btn login-btn-3">
                회원가입
              </button>
            </div>
            <div className="signup-goto-main">
              <Link to="/main" className="main-signup-b">
                메인으로 돌아가기
              </Link>
            </div>
          </form>

          <div className="main-login-forget"></div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
};

export default SignUpPage;
