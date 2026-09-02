export type TabType =
  "home" | "explore" | "communities" | "streaks" | "profile";

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  createdAt: string;
  category: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  streakDays: number;
  level: number;
  xp: number;
  xpNextLevel: number;
  streakCalendar: boolean[];
  gallery: GalleryItem[];
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timeAgo: string;
}

export interface PostItem {
  id: string;
  author: UserProfile;
  content: string;
  title?: string;
  image_url?: string;
  imageAlt?: string;
  tag?: string;
  created_at: string;
  likesCount: number;
  reactions: {
    heart: number;
    surprised: number;
    sparkles: number;
  };
  comments: CommentItem[];
  userLiked?: boolean;
}

export interface PostBoxProps {
  currentUser?: UserProfile;
  onPost?: (postData: {
    content: string;
    image_url?: string;
  }) => void | Promise<void>;
  placeholder?: string;
  className?: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  tagColor: string;
  topBorderColor: string;
  iconName: string;
  description: string;
  coverImage: string;
  membersCount: number;
  membersAvatars: string[];
  isJoined?: boolean;
  rules: string[];
  tags: string[];
}

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}
