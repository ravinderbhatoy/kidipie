import { createContext } from "react";
import type { PostItem, UserProfile } from "../types";

export interface PostsContextType {
  userProfile: UserProfile;
  posts: PostItem[];
  addPost: (postData: {
    content: string;
    imageUrl?: string;
    tag?: string;
  }) => void;
  toggleLikePost: (postId: string) => void;
  addReaction: (
    postId: string,
    reactionType: "heart" | "surprised" | "sparkles",
  ) => void;
  addComment: (postId: string, text: string) => void;
}

export const PostsContext = createContext<PostsContextType | undefined>(
  undefined,
);
