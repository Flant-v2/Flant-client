import axios, { AxiosInstance, AxiosResponse } from "axios";

// 환경 변수에서 설정 가져오기
const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const API_TIMEOUT = Number(process.env.API_TIMEOUT);

// Axios 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: REACT_APP_BACKEND_API_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 토큰 만료 시 리프레시 토큰으로 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const res = await axios.post(
          `${REACT_APP_BACKEND_API_URL}/auth/refresh`,
          { refreshToken }
        );
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
// 공통 에러 처리 함수
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    console.error("API Error:", error.response?.data);
    // 여기에 사용자에게 에러 메시지를 표시하는 로직 추가
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};

export const authApi = {
  signIn: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }).catch(handleApiError),
  signUp: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) =>
    api
      .post("/auth/sign-up", { name, email, password, passwordConfirm })
      .catch(handleApiError),
  googleLogin: (token: string) =>
    api.post("/auth/google", { token }).catch(handleApiError),
  signOut: () => api.post("/auth/sign-out").catch(handleApiError),
};

export const userApi = {
  findMy: () => api.get("/users/me").catch(handleApiError),
  update: (
    newUserName?: string,
    newPassword?: string,
    confirmNewPassword?: string
  ) =>
    api
      .patch("/users/me", { newUserName, newPassword, confirmNewPassword })
      .catch(handleApiError),
  checkPassword: (password: string) =>
    api.post("/users/check-password", { password }).catch(handleApiError),
  delete: () => api.delete("/users/me").catch(handleApiError),
};

export const communityApi = {
  findAll: () => api.get("/communities").catch(handleApiError),
  findOne: (id: number) => api.get(`/communities/${id}`).catch(handleApiError),
  findMy: () => api.get("/communities/me").catch(handleApiError),
  // 커뮤니티 가입
  joinCommunity: (communityId: number, nickName: string) =>
    api
      .post(`/communities/${communityId}/assign`, { nickName })
      .catch(handleApiError),
};

export const postApi = {
  create: (formData: FormData) =>
    api
      .post(`/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch(handleApiError),
  getPosts: (isArtist: boolean, communityId: number, page = 1, limit = 10) =>
    api
      .get(`/posts`, { params: { isArtist, communityId, page, limit } })
      .catch(handleApiError),
  like: (postId: number, { status }: { status: number }) =>
    api.put(`/posts/${postId}/likes`, { status }).catch(handleApiError),
  checkIfUserLikedPost: (id: number) =>
    api.get(`/posts/${id}/likes/my`).catch(handleApiError),
  countLikesOnPost: (postId: number) =>
    api.get(`/posts/${postId}/likes`).catch(handleApiError),
};

export const commentApi = {
  create: ({
    postId,
    comment,
    communityId,
    artistId,
  }: // imageUrl,
  {
    postId: number;
    comment: string;
    communityId: number;
    artistId?: number;
    // artistId?: number;
    // imageUrl?: string;
  }) =>
    api
      .post(`/posts/${postId}/comments`, {
        comment,
        communityId,
        artistId,
      })
      .catch(handleApiError),

  createReply: (commentId: number, { content }: { content: string }) =>
    api
      .post(`/comments/${commentId}/replies`, { content })
      .catch(handleApiError),
  getComments: (postId: number, isArtist: boolean = false) =>
    api
      .get(`/posts/${postId}/comments?isArtist=${isArtist}`)
      .catch(handleApiError),
  like: (id: number, { status }: { status: number }) =>
    api.put(`/comments/${id}/likes`, { status }).catch(handleApiError),

  checkIfUserLikedComment: (id: number) =>
    api.get(`/comments/${id}/likes/my`).catch(handleApiError),

  patchComment: (
    commentId: number,
    { comment, isArtist }: { comment: string; isArtist?: number } // communityId 제거
  ) =>
    api
      .patch(`/comments/${commentId}`, { comment, isArtist })
      .catch(handleApiError),

  deleteComment: (commentId: number) =>
    api.delete(`/comments/${commentId}`).catch(handleApiError),
};

export const liveApi = {
  createLive: (artistId: string, title: string, liveType: string) =>
    api.post("/live", { artistId, title, liveType }).catch(handleApiError),
  watchLive: (liveId: number) =>
    api.get(`/live/${liveId}`).catch(handleApiError),
  findLives: (communityId: number) =>
    api.get(`/live?communityId=${communityId}`).catch(handleApiError),
  findRecordings: (liveId: number) =>
    api.get(`/live/${liveId}/recordings`).catch(handleApiError),

};

export const communityUserApi = {
  findCommunityUser: (communityId: number) =>
    api.get(`/communities/userInfo/${communityId}`).catch(handleApiError),
};

export const merchandiseApi = {
  // 카테고리 조회 API
  fetchCategories: (communityId: number) =>
    api.get(`/merchandise/category`, { params: { communityId } }),

  // 상품 전체 조회 API
  fetchMerchandises: (communityId: number, merchandiseCategoryId: number) =>
    api.get(`/merchandise`, {
      params: { communityId, merchandiseCategoryId },
    }),

  // 상품 상세 조회 API
  fetchMerchandiseDetail: (merchandiseId: number) =>
    api.get(`/merchandise/${merchandiseId}`),

  // 장바구니 추가 API
  addToCart: (
    merchandiseId: number,
    merchandiseOptionId: number,
    quantity: number
  ) =>
    api
      .post("/carts", { merchandiseId, merchandiseOptionId, quantity })
      .catch(handleApiError), // 공통 에러 처리 함수 사용
};

export const cartApi = {
  // 카트 조회 API
  fetchCart: () => api.get("/carts").catch(handleApiError), // 공통 에러 처리 함수 사용

  // 카트 아이템 수량 수정 API
  updateCartItemQuantity: (
    cartItemId: number,
    quantity: "INCREMENT" | "DECREMENT"
  ) => api.patch(`/carts/items/${cartItemId}?quantity=${quantity}`),
  // 카트 항목 삭제 API
  removeCartItem: (cartItemId: number) =>
    api.delete(`/carts/items/${cartItemId}`).catch(handleApiError),
};

// 결제 관련 API 호출
export const paymentApi = {
  createOrder: () => api.post("/orders").catch(handleApiError), // 결제 API 엔드포인트
};

// 멤버십 관련 API 호출
export const membershipApi = {
  joinMembership: (userId: number, communityId: number) =>
    api.post(`/membership`, { communityId }).catch(handleApiError),
  existedMembership: () => api.get(`/membership`).catch(handleApiError),
};

export const mediaApi = {
  createMedia: (formData: FormData) =>
    api
      .post(`/media`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch(handleApiError),
  getMediaList: (communityId: number) =>
    api.get("/media", { params: { communityId } }).catch(handleApiError),
  getMediaOne: (mediaId: number) =>
    api.get(`/media/${mediaId}`).catch(handleApiError),
  patchThumbnail: (formData: FormData, mediaId: number) =>
    api
      .patch(`/media/${mediaId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .catch(handleApiError)
      .catch(handleApiError),
};
