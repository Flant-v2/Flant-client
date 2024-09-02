export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  password: string;
  name?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
  profile_image?: string;
}

// src/types/user.types.ts
export enum UserRole {
  User = "user",
  Admin = "admin",
}
export enum UserProvider {
  Email = "email",
  Google = "google",
  // 다른 provider가 있다면 추가
}
export interface User {
  userId: number;
  name: string;
  email: string;
  profileImage: string;
  role: UserRole;
  point: number;
  provider: UserProvider;
  createdAt: Date;
  updatedAt: Date;
}
