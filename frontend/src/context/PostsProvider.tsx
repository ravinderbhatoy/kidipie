import React, { useState } from 'react';
import type { PostItem, UserProfile } from '../types';
import { PostsContext } from './PostsContext';

const DEFAULT_USER: UserProfile = {
  id: 'user-1',
  name: 'RayPamber',
  title: 'Digital Alchemist',
  bio: 'Transforming ideas into reality, one project at a time.',
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  streakDays: 10,
  level: 5,
  xp: 500,
  xpNextLevel: 1000,
  streakCalendar: [true, true, false, true, false, true, true],
  gallery: [
    {
      id: 'g1',
      title: 'Neon Robot Sketch',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      likes: 24,
      createdAt: '2 days ago',
      category: 'Art',
    },
    {
      id: 'g2',
      title: 'Volcano Experiment',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      likes: 42,
      createdAt: '5 days ago',
      category: 'Science',
    },
  ],
};

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    author: {
      ...DEFAULT_USER,
      name: 'Mia_Arts',
      title: 'Junior Illustrator',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    content: 'Just finished drawing a magical galaxy cat! 🌌🐱 What do you think?',
    image_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    tag: 'Drawing',
    created_at: '20m ago',
    likesCount: 14,
    reactions: { heart: 8, surprised: 3, sparkles: 5 },
    comments: [
      {
        id: 'c1',
        authorName: 'LeoBuilds',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        text: 'The colors are amazing! ✨',
        timeAgo: '15m ago',
      },
    ],
    userLiked: false,
  },
  {
    id: 'post-2',
    author: {
      ...DEFAULT_USER,
      name: 'LeoBuilds',
      title: 'Lego Engineer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    content: 'Built a solar-powered rover using recycled parts and motors! 🚀⚡',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    tag: 'Science',
    created_at: '2h ago',
    likesCount: 29,
    reactions: { heart: 12, surprised: 9, sparkles: 14 },
    comments: [],
    userLiked: true,
  },
];

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile] = useState<UserProfile>(DEFAULT_USER);
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);

  const addPost = (postData: { content: string; imageUrl?: string; tag?: string }) => {
    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      author: userProfile,
      content: postData.content,
      image_url: postData.imageUrl,
      tag: postData.tag,
      created_at: 'Just now',
      likesCount: 0,
      reactions: { heart: 0, surprised: 0, sparkles: 0 },
      comments: [],
      userLiked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLikedState = !post.userLiked;
          return {
            ...post,
            userLiked: newLikedState,
            likesCount: newLikedState ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const addReaction = (postId: string, reactionType: 'heart' | 'surprised' | 'sparkles') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1,
            },
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: userProfile.name,
            authorAvatar: userProfile.avatar,
            text: text.trim(),
            timeAgo: 'Just now',
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  return (
    <PostsContext.Provider
      value={{
        userProfile,
        posts,
        addPost,
        toggleLikePost,
        addReaction,
        addComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
