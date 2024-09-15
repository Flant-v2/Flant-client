import React, { useState, useEffect } from 'react';
import { getPosts } from './apiService';

// 게시물 목록을 표시하는 컴포넌트
function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 게시물 목록을 가져오는 함수
        const fetchPosts = async () => {
            const data = await getPosts();
            setPosts(data);
        };

        fetchPosts();
    }, []);

    return (
        <div className="container">
            <h2>게시물 목록</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.content}</li>
                ))}
            </ul>
        </div>
    );
}

export default PostList;
