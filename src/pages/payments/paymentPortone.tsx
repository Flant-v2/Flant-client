import { RequestPayParams } from "./../../types/portone.d";
import { RequestPayResponse } from "./../../types/portone.d";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
interface PaymentPortoneProps {
  amount: number; // 결제 금액
  onPaymentSuccess: () => void; // 결제 성공 시 호출할 콜백 함수
}

export const PaymentPortone: React.FC<PaymentPortoneProps> = ({
  amount,
  onPaymentSuccess,
}) => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false); // 결제 처리 상태
  useEffect(() => {
    onClickPayment();
  }, []);
  const onClickPayment = () => {
    if (!window.IMP) return;
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;

    IMP.init(process.env.REACT_APP_IMP_VALUE); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data: RequestPayParams = {
      pg: "tosspayments", // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: amount, // 결제금액
      name: "Flant", // 주문명
      buyer_name: "홍길동", // 구매자 이름
      buyer_tel: "01012341234", // 구매자 전화번호
      buyer_email: "example@example.com", // 구매자 이메일
      buyer_addr: "신사동 661-16", // 구매자 주소
      buyer_postcode: "06018", // 구매자 우편번호
    };

    setIsPaymentProcessing(true);

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  /* 3. 콜백 함수 정의하기 */
  function callback(response: RequestPayResponse) {
    if (response.error_code) {
      alert(response.error_msg);
      setIsPaymentProcessing(false); // 결제 실패 시 상태 초기화
      return;
    }
    console.log(response);
    //error_msg
    alert("결제 성공");
    onPaymentSuccess(); // 결제 성공 시 콜백 호출
    setIsPaymentProcessing(false); // 결제 성공 후 상태 초기화
  }

  return null;
};

export default PaymentPortone;
