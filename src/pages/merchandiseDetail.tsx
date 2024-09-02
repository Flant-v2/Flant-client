import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { merchandiseApi, authApi, communityApi } from '../services/api';
import './merchandiseDetail.scss'; // CSS 파일 추가
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";
import Header from "../components/communityBoard/Header";

interface MerchandiseImage {
  merchandiseImageId: number;
  url: string;
}

interface MerchandiseOption {
  id: number;
  optionName: string;
}

interface MerchandiseDetail {
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  content: string; // 상품 상세 설명
  merchandiseImage: MerchandiseImage[];
  merchandiseOption: MerchandiseOption[]; // 옵션 추가
}

interface Community {
  communityName: string;
  // 추가로 필요한 community 속성이 있다면 여기에 추가
}

const getToken = () => localStorage.getItem("accessToken");

const MerchandiseDetail: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { merchandiseId } = useParams<{ merchandiseId: string }>();
  const navigate = useNavigate();
  const [merchandise, setMerchandise] = useState<MerchandiseDetail | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token); // 로그인 여부 판단

    const fetchMerchandiseDetail = async () => {
      try {
        if (merchandiseId) {
          const response = await merchandiseApi.fetchMerchandiseDetail(Number(merchandiseId));
          setMerchandise(response.data.data);
        }
      } catch (error) {
        console.error("상품 상세 정보 조회 실패:", error);
      }
    };

    fetchMerchandiseDetail();
  }, [merchandiseId]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        if (merchandiseId) {
          const communityResponse = await communityApi.findOne(Number(communityId));
          setCommunity(communityResponse.data);
        }
      } catch (error) {
        console.error("커뮤니티 조회 실패:", error);
      }
    };

    fetchCommunity();
  }, [merchandiseId]);

  const handleAddToCart = async () => {
    if (!merchandise || selectedOption === null || quantity <= 0) {
      alert("옵션을 선택하고 수량을 올바르게 입력해 주세요.");
      return;
    }

    try {
      const response = await merchandiseApi.addToCart(
        merchandise.merchandiseId,
        selectedOption,
        quantity
      );
      alert(response.data.message); // API 응답 메시지 표시
    } catch (error) {
      console.error("장바구니 추가 실패:", error);
      alert("장바구니 추가에 실패했습니다.");
    }
  };

  const handleNavigateToCart = () => {
    navigate("/cart");
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃 성공");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <div className="merchandise-detail-page">
      {community && (
        <>
          <Header
            communityName={community.communityName}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
          <CommunityNavigationHeader />
        </>
      )}

      {/* Main Content */}
      <div className="merchandise-detail">
        <div className="thumbnail">
          <img src={merchandise?.thumbnail} alt={merchandise?.merchandiseName} />
        </div>
        <h2>{merchandise?.merchandiseName}</h2>
        <p className="price">Price: {merchandise?.price} 원</p>

        <div className="options">
          <label htmlFor="option">Option:</label>
          <select
            id="option"
            value={selectedOption ?? ""}
            onChange={(e) => setSelectedOption(Number(e.target.value))}
          >
            <option value="" disabled>Select an option</option>
            {merchandise?.merchandiseOption.map(option => (
              <option key={option.id} value={option.id}>
                {option.optionName}
              </option>
            ))}
          </select>
        </div>

        <div className="quantity">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="action-buttons">
          <button onClick={handleAddToCart}>Add to Cart</button>
          <button onClick={handleNavigateToCart} className="go-to-cart-button">Go to Cart</button>
        </div>

        <div className="content">
          {merchandise?.merchandiseImage.map((image) => (
            <img 
              key={image.merchandiseImageId} 
              src={image.url} 
              alt={`Image ${image.merchandiseImageId}`} 
              className="detail-image" 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchandiseDetail;
