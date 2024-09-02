// src/components/UserUpdateForm.tsx
import React, { useState } from "react";
import { userApi } from "../services/api";
import { UpdateUserDto } from "../types/user";

const UserUpdateForm: React.FC<{ userId: number }> = ({ userId }) => {
  const [userData, setUserData] = useState<UpdateUserDto>({
    password: "",
    name: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //await userApi.update(userId, userData);
      alert("User updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={userData.newPassword || ""}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
};

export default UserUpdateForm;
