export interface Community {
  communityId: number;
  communityName: string;
  description: string;
  membershipPrice: number;
  communityLogoImage: string;
  communityCoverImage: string;
  createdAt: string;
}

interface PostImage {
  postImageId: number;
  postImageUrl: string;
}

export interface Post {
  postId: number;
  nickname: string;
  content: string;
  profileImage: string;
  postImages?: PostImage[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  commentId: number;
  communityId: number;
  author: string;
  authorId: number;
  comment: string;
  createdAt: string;
  profileImage?: string; // 프로필 이미지를 위한 속성 추가
  isArtist?: boolean; // 아티스트 여부를 위한 속성 추가
}

export interface User {
  id: number;
  email: string;
  name: string;
  profileImage: string;
  role: string;
}

export interface CommunityUser {
  communityUserId: number;
  userId: number;
  communityId: number;
  nickName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  membershipId: number;
  communityUserId: number;
  communityId: number;
  createdAt: Date;
  updatedAt: Date;
  expiration: Date;
  deletedAt: Date;
}
