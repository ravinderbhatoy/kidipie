import React, { useEffect, useState } from "react";
import PostBox from "../components/PostBox";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import { fetchPosts } from "../api/axios";

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetchPosts();
        console.log(response)
        setPosts(response)
      } catch (error) {
        console.error("Failed to fetch posts", error);
        throw error
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [])

  if (loading) {
    return <p>Loading...</p>;
  }

  const { userProfile, addPost } = usePosts();
  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <PostBox
        currentUser={userProfile}
        onPost={addPost}
        placeholder="Share your latest project or idea..."
      />

      {/* Feed List */}
      {posts?.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-medium)] rounded-2xl p-8 text-center">
          <p className="text-[var(--text-muted)] font-medium">
            No posts yet. Share something above to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
