import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi, communityApi, merchandiseApi } from '../services/api';
import './merchandiseList.scss';
import CommunityNavigationHeader from "../components/communityBoard/CommunityNavigationHeader";
import Header from "../components/communityBoard/Header";

interface Merchandise {
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  merchandiseCategoryId: number;
}

interface Category {
  merchandiseCategoryId: number;
  categoryName: string;
}

interface Community {
  communityName: string;
  // 추가로 필요한 community 속성이 있다면 여기에 추가
}

const getToken = () => localStorage.getItem("accessToken");

const MerchandiseList: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchandises, setMerchandises] = useState<{ [key: number]: Merchandise[] }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: number]: number }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [community, setCommunity] = useState<Community | null>(null);
  const [hasMerchandises, setHasMerchandises] = useState<boolean>(false); // 초기 상태를 false로 설정
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (communityId) {
          const categoryResponse = await merchandiseApi.fetchCategories(Number(communityId));
          setCategories(categoryResponse.data.data.categories);
        }
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
      }
    };

    fetchCategories();
  }, [communityId]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        if (communityId) {
          const communityResponse = await communityApi.findOne(Number(communityId));
          setCommunity(communityResponse.data);
        }
      } catch (error) {
        console.error("커뮤니티 조회 실패:", error);
      }
    };

    fetchCommunity();
  }, [communityId]);

  useEffect(() => {
    const fetchMerchandisesByCategory = async () => {
      try {
        const merchandiseData: { [key: number]: Merchandise[] } = {};
        let hasItems = false;

        for (const category of categories) {
          const response = await merchandiseApi.fetchMerchandises(Number(communityId), category.merchandiseCategoryId);
          merchandiseData[category.merchandiseCategoryId] = response.data.data;
          
          if (response.data.data.length > 0) {
            hasItems = true;
          }
        }

        setMerchandises(merchandiseData);
        setHasMerchandises(hasItems);

        // 각 카테고리마다 현재 페이지를 초기화
        const initialPage: { [key: number]: number } = {};
        categories.forEach((category) => {
          initialPage[category.merchandiseCategoryId] = 0;
        });
        setCurrentPage(initialPage);
      } catch (error) {
        console.error("상품 조회 실패:", error);
      }
    };

    if (categories.length > 0) {
      fetchMerchandisesByCategory();
    }
  }, [categories, communityId]);

  const handleMerchandiseClick = (merchandiseId: number) => {
    navigate(`/communities/${communityId}/merchandise/${merchandiseId}`);
  };

  const handlePrevPage = (categoryId: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: Math.max(prev[categoryId] - 1, 0)
    }));
  };

  const handleNextPage = (categoryId: number, totalItems: number) => {
    const maxPage = Math.ceil(totalItems / 4) - 1;
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: Math.min(prev[categoryId] + 1, maxPage)
    }));
  };

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("isLoggedIn");
      await authApi.signOut();
      localStorage.clear();
      alert("로그아웃이 성공적으로 되었습니다.");
      navigate("/main");
      window.location.reload();
    } catch (error) {
      alert("로그아웃 실패.");
    }
  };

  return (
    <div className="community-board">
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

      <div className="merchandise-list">
        {categories.length === 0 ? (
          <p>상품 준비중입니다.</p>
        ) : hasMerchandises ? (
          categories.map((category) => {
            const items = merchandises[category.merchandiseCategoryId] || [];
            const currentPageIndex = currentPage[category.merchandiseCategoryId] || 0;
            const startIndex = currentPageIndex * 4;
            const visibleItems = items.slice(startIndex, startIndex + 4);

            return (
              <div key={category.merchandiseCategoryId} className="category-section">
                <h2>{category.categoryName}</h2>
                <div className="merchandise-slider">
                  {/* 왼쪽 화살표 */}
                  {currentPageIndex > 0 && (
                    <button className="slider-button prev-button" onClick={() => handlePrevPage(category.merchandiseCategoryId)}>
                      ◀
                    </button>
                  )}

                  {/* 상품 리스트 */}
                  <ul className="merchandise-items">
                    {visibleItems.map((merchandise) => (
                      <li 
                        key={merchandise.merchandiseId}
                        onClick={() => handleMerchandiseClick(merchandise.merchandiseId)}
                      >
                        <div className="image-container">
                          <img
                            src={merchandise.thumbnail}
                            alt={merchandise.merchandiseName}
                          />
                        </div>
                        <p>{merchandise.merchandiseName}</p>
                        <p>Price: {merchandise.price} 원</p>
                      </li>
                    ))}
                  </ul>

                  {/* 오른쪽 화살표 */}
                  {startIndex + 4 < items.length && (
                    <button className="slider-button next-button" onClick={() => handleNextPage(category.merchandiseCategoryId, items.length)}>
                      ▶
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>상품 준비중입니다.</p>
        )}
      </div>
    </div>
  );
};

export default MerchandiseList;
