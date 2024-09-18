import React, { useState, useEffect } from "react";
import { postApi, communityApi } from "../../services/api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PostForm.scss";

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const { communityId } = useParams<{ communityId: string }>();
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]); // 파일명 상태 추가
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCommunityJoined, setIsCommunityJoined] = useState(false); // 커뮤니티 가입 여부 상태 추가
  const navigate = useNavigate();
  useEffect(() => {
    const checkIfCommunityJoined = async () => {
      try {
        if (communityId) {
          const response = await communityApi.findMy();
          const myCommunity = response.data.data;
          setIsCommunityJoined(
            myCommunity.some((c: any) => c.communityId === Number(communityId))
          );
        }
      } catch (error) {
        console.error("커뮤니티 가입 여부 확인 오류:", error);
      }
    };

    checkIfCommunityJoined();
  }, [communityId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!communityId) {
      throw new Error("communityId가 제공되지 않았습니다.");
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      const formData = new FormData();
      formData.append("content", content);
      //내용을 입력하지 않았거나 공백(스페이스바)만 입력된 경우
      if(!content.trim()){
        alert("내용을 입력해주세요.")
        return
      }
      formData.append("communityId", communityId);
      images.forEach((image) => formData.append("postImage", image));

      await postApi.create(formData);
      setContent("");
      setImages([]);
      setSelectedFileNames([]); // 폼 제출 후 파일명 초기화
      onPostCreated();
      setIsFormOpen(false);
    } catch (error) {
      console.error("게시물 생성 오류:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate("/login");
      }
    }
  };
  // 커뮤니티 가입 여부를 확인하는 함수
  const checkIfCommunityJoined = async () => {
    try {
      const response = await communityApi.findMy();
      const myCommunity = response.data.data;
      setIsCommunityJoined(
        myCommunity.some((c: any) => c.communityId === Number(communityId))
      );
    } catch (error) {
      console.error("커뮤니티 가입 여부 확인 오류:", error);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
      setSelectedFileNames(filesArray.map((file) => file.name)); // 선택된 파일명 저장
    }
  };

  const triggerFileInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fileInput = document.querySelector<HTMLInputElement>(
      ".image-upload-input"
    );
    fileInput?.click();
  };

  return (
    <>
      <div
        className={`floating-btn ${isFormOpen ? "open" : ""} ${
          !isCommunityJoined ? "disabled" : ""
        }`}
        onClick={() => {
          if (isCommunityJoined) {
            setIsFormOpen(true);
          }
        }}
      >
        <span className="post-text">게시글을 남겨보세요</span>
      </div>

      {isFormOpen && (
        <div className="overlay">
          <div className="floating-form">
            <form
              onSubmit={handleSubmit}
              className="post-form"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="플랜트에 포스트를 남겨보세요."
                className="content-input"
              />

              <div className="form-actions">
                <div className="floating-form-upload">
                  <div className="custom-file-upload">
                    <button className="upload-btn" onClick={triggerFileInput}>
                      이미지 업로드
                    </button>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      multiple
                      accept="image/*"
                      className="image-upload-input"
                    />
                  </div>
                  <div className="selected-files">
                    {selectedFileNames.length > 0 && (
                      <ul>
                        {selectedFileNames.map((fileName, index) => (
                          <li key={index}>{fileName}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  게시
                </button>
              </div>
            </form>

            <button className="close-btn" onClick={() => setIsFormOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PostForm;
