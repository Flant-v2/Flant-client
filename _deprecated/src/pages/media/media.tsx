import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './media.scss';
import { authApi, communityApi, mediaApi } from '../../services/api';
import CommunityNavigationHeader from '../../components/communityBoard/CommunityNavigationHeader';
import Header from '../../components/communityBoard/Header';

interface MediaFile {
    mediaFilesId: number;
    mediaId: number;
    managerId: number;
    mediaFileUrl: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface MediaItem {
    mediaId: number;
    title: string;
    content: string;
    thumbnailImage: string | undefined;
    mediaFiles: MediaFile[]; // mediaFiles 배열이 MediaFile 객체들의 배열로 변경됨
  }

const Media: React.FC = () => {
  const { communityId, mediaId } = useParams<{ communityId: string; mediaId?: string }>();
  const navigate = useNavigate();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [community, setCommunity] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인용

  // 로그인 여부 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"; // localStorage에서 로그인 여부 확인
      if (!loggedIn) {
        navigate('/login'); // 로그인하지 않았다면 로그인 페이지로 이동
      } else {
        setIsLoggedIn(true); // 로그인 상태 설정
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await communityApi.findOne(Number(communityId)); // communityId로 커뮤니티 정보 가져오기
        setCommunity(response.data.data); // 커뮤니티 정보를 상태로 설정
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsManager(userRole === 'manager');

    mediaApi.getMediaList(Number(communityId))
      .then(response => {
        setMediaItems(response.data.data);
      })
      .catch(error => console.error('Error fetching media list:', error));
  }, [communityId]);

  useEffect(() => {
    if (mediaId) {
      mediaApi.getMediaOne(Number(mediaId))
        .then(response => {
          setSelectedMedia(response.data.data);
        })
        .catch(error => console.error('Error fetching media detail:', error));
    } else {
      setSelectedMedia(null); // mediaId가 없으면 리스트만 표시
    }
  }, [mediaId]);

  const handleMediaClick = (mediaId: number) => {
    navigate(`/communities/${communityId}/media/${mediaId}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      mediaApi.createMedia(formData)
        .then(() => mediaApi.getMediaList(Number(communityId)))
        .then(response => {
          setMediaItems(response.data.data);
        })
        .catch(error => console.error('Error uploading media:', error));
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>, mediaId: number) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      mediaApi.patchThumbnail(formData, mediaId)
        .then(() => mediaApi.getMediaList(Number(communityId)))
        .then(response => {
          setMediaItems(response.data.data);
        })
        .catch(error => console.error('Error updating thumbnail:', error));
    }
  };

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
      alert("로그아웃 실패.");
    }
  };

  return (
    <div className="media-container">
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
  
      {selectedMedia ? (
        <div className="media-detail-container">
          <h1 className="media-title">{selectedMedia.title}</h1>
          <div className="media-files">
            {selectedMedia.mediaFiles && selectedMedia.mediaFiles.length > 0 ? (
              selectedMedia.mediaFiles.map((file, index) => {
                if (file.mediaFileUrl.includes('youtube.com') || file.mediaFileUrl.includes('youtu.be')) {
                  // 유튜브 URL 처리
                  const youtubeVideoId = getYoutubeVideoId(file.mediaFileUrl);
                  return (
                    <iframe
                      key={index}
                      className="media-file"
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                } else if (file.mediaFileUrl.endsWith('.mp4')) {
                  // MP4 파일 처리
                  return (
                    <video key={index} controls className="media-file">
                      <source src={file.mediaFileUrl} type="video/mp4" />
                    </video>
                  );
                } else if (
                  file.mediaFileUrl.endsWith('.jpg') || 
                  file.mediaFileUrl.endsWith('.jpeg') || 
                  file.mediaFileUrl.endsWith('.png')
                ) {
                  // 이미지 파일 처리
                  return (
                    <img key={index} src={file.mediaFileUrl} alt={`Media ${index}`} className="media-file" />
                  );
                } else {
                  // 지원되지 않는 파일 형식 처리
                  return (
                    <div key={index}>Unsupported file format</div>
                  );
                }
              })
            ) : (
              <img src={selectedMedia.thumbnailImage} alt="Thumbnail" className="media-file" />
            )}
          </div>
          <div className="media-content">
            <p>{selectedMedia.content}</p>
          </div>
          <button onClick={() => navigate(`/communities/${communityId}/media`)}>Back to list</button>
        </div>
      ) : (
        <>
          {isManager && (
            <div className="upload-section">
              <label htmlFor="media-upload" className="upload-label">
                Upload Media
              </label>
              <input 
                type="file"
                id="media-upload"
                onChange={handleFileChange}
                className="upload-input"
              />
            </div>
          )}
  
          <div className="media-grid">
            {mediaItems.map((item) => (
              <div 
                key={item.mediaId} 
                className="media-item" 
                onClick={() => handleMediaClick(item.mediaId)}
              >
                {item.thumbnailImage ? (
                  <img src={item.thumbnailImage} alt={item.title} />
                ) : (
                  <div className="no-thumbnail">No Thumbnail</div>
                )}
                <p>{item.title}</p>
  
                {isManager && (
                  <label className="thumbnail-edit-label">
                    <input 
                      type="file"
                      onChange={(event) => handleThumbnailChange(event, item.mediaId)}
                      className="thumbnail-edit-input"
                    />
                    Edit Thumbnail
                  </label>
                )}
              </div>
            ))}
          </div>
        </>
      )}
  
      {isManager && !selectedMedia && (
        <button className="floating-button" onClick={() => document.getElementById('media-upload')?.click()}>
          +
        </button>
      )}
    </div>
  );
}

function getYoutubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

export default Media;