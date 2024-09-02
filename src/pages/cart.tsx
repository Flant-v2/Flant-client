import React, { useState, useEffect } from "react";
import { cartApi, paymentApi } from "../services/api";
import PaymentPortone from "./payments/paymentPortone";
import "./UserInfo.scss";
import "./cart.scss";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

interface CartItem {
  cartItemId: number;
  merchandiseId: number;
  merchandiseName: string;
  thumbnail: string;
  price: number;
  merchandiseOptionId: number;
  merchandiseOptionName: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartApi.fetchCart();
        setCartItems(response.data.data);
        setTotalAmount(getTotalPrice(response.data.data));
      } catch (error) {
        console.error("Error fetching cart items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const getTotalPrice = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const removeCartItem = async (cartItemId: number) => {
    try {
      const response = await cartApi.removeCartItem(cartItemId);
      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartItemId !== cartItemId)
        );
        setTotalAmount(getTotalPrice(cartItems)); // 가격 업데이트
      }
    } catch (error) {
      console.error("Error removing cart item", error);
    }
  };

  const updateQuantity = async (
    cartItemId: number,
    increment: boolean,
    currentQuantity: number
  ) => {
    if (!increment && currentQuantity === 1) {
      alert("최소 수량입니다.");
      return;
    }

    try {
      const response = await cartApi.updateCartItemQuantity(
        cartItemId,
        increment ? "INCREMENT" : "DECREMENT"
      );
      if (response.status === 200) {
        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.cartItemId === cartItemId
              ? {
                  ...item,
                  quantity: response.data.data.updatedCartItem.quantity,
                }
              : item
          );
          setTotalAmount(getTotalPrice(updatedItems)); // 가격 업데이트
          return updatedItems;
        });
      }
    } catch (error) {
      console.error("Error updating cart item quantity", error);
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false); // 결제 창 표시
    await paymentApi.createOrder(); // 주문 생성 API 호출
    navigate("/main");
  };

  const handleCheckout = async () => {
    try {
      setShowPayment(true); // 결제 창 표시
    } catch (error) {
      console.error("주문 생성 실패:", error);
      alert("주문을 처리하는 중 문제가 발생했습니다.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="cart-container">
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
      <h2>My Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty.</div>
      ) : (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div
              key={item.cartItemId}
              className="cart-item"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.thumbnail}
                alt={item.merchandiseName}
                className="thumbnail"
              />
              <div className="item-details">
                <h3>{item.merchandiseName}</h3>
                <p>Option: {item.merchandiseOptionName}</p>
                <p>Price: {item.price} 원</p>
                <div className="quantity-control">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.cartItemId, false, item.quantity);
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item.cartItemId, true, item.quantity);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCartItem(item.cartItemId);
                }}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: {totalAmount}원</h3>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
      {showPayment && (
        <PaymentPortone
          amount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Cart;
