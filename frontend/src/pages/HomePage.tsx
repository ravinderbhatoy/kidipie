import React from "react";
import { usePosts } from "../hooks/usePosts";
import PostBox from "../components/PostBox";

import PostCard from "../components/PostCard";

export const HomePage: React.FC = () => {
  const { userProfile, posts, addPost } = usePosts();
  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <PostBox
        currentUser={userProfile}
        onPost={addPost}
        placeholder="Share your latest project or idea..."
      />

      {/* Feed List */}
      {posts.length > 0 ? (
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
