import React, { useEffect, useState } from "react";
import "./UserInfo.scss";
import { Link, useNavigate } from "react-router-dom";
import { authApi, userApi } from "../services/api";
import { isValidName } from "../utils/validateName";
import { isEmpty } from "../utils/isEmpty";
import { validatePassword } from "../utils/validatePassword";

const UserInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUsername] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newUserName, setNewUserName] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setConfirmNewPassword] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);

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

  const handleUpdateAccount = async () => {
    try {
      // 값이 모두 비어있는 경우
      if (
        isEmpty(newUserName) &&
        isEmpty(newPassword) &&
        isEmpty(newPasswordConfirm)
      ) {
        alert("변경할 값을 입력해주세요.");
        return;
      }

      // 이름 변경시
      if (!isEmpty(newUserName) && !isValidName(newUserName)) {
        alert(
          "변경할 이름을 확인해주세요. 특수 문자 및 공백,'admin'은 사용할 수 없습니다."
        );
        return;
      }

      // 비밀번호 변경시
      if (!isEmpty(newPassword)) {
        if (!validatePassword(newPassword)) {
          alert(
            "비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수 문자를 포함해야 합니다."
          );
          return;
        }

        if (newPassword !== newPasswordConfirm) {
          alert("비밀번호 확인이 일치하지 않습니다.");
          return;
        }
      }

      await userApi.update(newUserName, newPassword, newPasswordConfirm);
      alert("계정 정보가 성공적으로 변경되었습니다.");

      setShowUpdateDialog(false);
      setPassword("");

      clearUpdateUserInputText();
    } catch (error) {
      alert("계정 정보 변경에 실패했습니다.");
    }
  };

  // 내 정보 input창 초기화
  const clearUpdateUserInputText = async () => {
    setNewUserName("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await userApi.checkPassword(password);
      if (response.data.statusCode === 200) {
        await userApi.delete();
        await authApi.signOut(); // 쿠키 삭제 위한 용도
        localStorage.clear();
        alert("계정이 성공적으로 삭제되었습니다.");
        navigate("/main");
        window.location.reload();
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      alert("비밀번호 재확인 바랍니다.");
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await userApi.findMy();
        const userName = userInfo.data.data.name;
        const userEmail = userInfo.data.data.email;
        setUsername(userName);
        setUserEmail(userEmail);
      } catch (error) {
        alert("Failed to fetch userinfo");
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="main-page">
      <header>
        <div className="header-box">
          <Link to="/main" className="header-box-logo">
            <img
              className="header-box-logo-image"
              src="/favicon.ico"
              alt="logo"
            />
          </Link>
          <div className="header-box-blank"></div>
          <div className="header-box-user">
            <div className="header-box-user-info">
              <button>
                <img
                  className="header-notification-icon"
                  src="/images/notification.png"
                  alt="notification"
                />
              </button>
              <div
                className="header-box-user-dropdown-container"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <button>
                  <img
                    className="header-user-icon"
                    src="/images/user.png"
                    alt="user"
                  />
                </button>
                {isDropdownVisible && (
                  <div className="header-user-dropdown">
                    <Link to="/userinfo">내 정보</Link>
                    {/* <Link to="/membership">멤버십</Link> */}
                    <Link to="/cart">장바구니</Link>
                    <button onClick={handleLogout}>로그아웃</button>
                  </div>
                )}
              </div>
            </div>

            <div className="header-box-user-shop">
              <Link to="#">
                <img
                  style={{ marginLeft: "25px", marginTop: "6px" }}
                  className="header-box-shop-image"
                  src="/green-cart.png"
                  alt="green-cart"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="black-background">
          <div className="black-background-left">
            <div className="black-background-title-name">
              {userName}님 환영합니다.
            </div>
            <div className="black-background-title-email">{userEmail}</div>
          </div>
          <div>
            <button
              onClick={() => setShowUpdateDialog(true)}
              className="black-background-button"
            >
              계정 정보 변경
            </button>
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="black-background-button"
            >
              계정 삭제
            </button>
          </div>
        </div>
        {showConfirmDialog && (
          <div className="confirm-dialog">
            <p>정말 탈퇴하시겠습니까?</p>
            <button onClick={() => setShowPasswordInput(true)}>예</button>
            <button onClick={() => setShowConfirmDialog(false)}>아니오</button>
          </div>
        )}

        {showPasswordInput && (
          <div className="password-input-dialog">
            <p>비밀번호를 입력하세요:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleDeleteAccount}>확인</button>
            <button
              onClick={() => {
                setShowPasswordInput(false);
                setPassword("");
              }}
            >
              취소
            </button>
          </div>
        )}

        {showUpdateDialog && (
          <div className="update-dialog">
            <p className="update-dialog-title">변경할 정보를 입력하세요</p>
            <div className="update-dialog-section">
              <label htmlFor="newUserName" className="update-dialog-label">
                변경할 닉네임
              </label>
              <input
                id="newUserName"
                className="update-dialog-input"
                type="text"
                placeholder="새로운 이름"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="update-dialog-section">
              <label htmlFor="newPassword" className="update-dialog-label">
                변경할 비밀번호
              </label>
              <input
                id="newPassword"
                className="update-dialog-input"
                type="password"
                placeholder="새로운 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="update-dialog-section">
              <label
                htmlFor="newPasswordConfirm"
                className="update-dialog-label"
              >
                비밀번호 확인
              </label>
              <input
                id="newPasswordConfirm"
                className="update-dialog-input"
                type="password"
                placeholder="비밀번호 확인"
                value={newPasswordConfirm}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleUpdateAccount}
              className="update-dialog-button"
            >
              확인
            </button>
            <button
              onClick={() => {
                setShowUpdateDialog(false);
                clearUpdateUserInputText();
              }}
              className="update-dialog-button"
            >
              취소
            </button>
          </div>
        )}
      </main>
      <footer></footer>
    </div>
  );
};

export default UserInfoPage;
