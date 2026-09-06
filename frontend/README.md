# Kidipie - Frontend

Kidipie is a creative social and learning platform designed for young creators to showcase projects, drawings, crafts, and science experiments in a fun, gamified environment.

---

## 🚀 Features Implemented So Far

### 1. **Feed & Post Creation (Home)**
- **Post Feed:** Displays community posts with image attachments, timestamps, tags, and author info.
- **Interactions:** Post liking, emoji reactions (`✨ Sparkles`, `😄 Wow`, `❤️ Heart`), and a commenting drawer.
- **Post Box:** Component to share posts with text, photo upload preview, and category tags (*Project, Drawing, Craft, Science*).
- **Backend Connection:** Connected to API endpoints for listing (`/posts/list`) and creating posts (`/posts/create`).

### 2. **Explore & Discovery**
- Search and filter projects by categories (*Art, Science, Code, Crafts*).
- Visual project cards displaying creator information and engagement metrics.

### 3. **Communities**
- Interactive community hubs (e.g., *Art Club, Young Coders, Science Lab, Lego Crafters*).
- Join/leave community toggles, active member counts, and community guidelines/rules.

### 4. **Gamification & Streaks**
- **Streak Tracker:** Daily streak counter with a weekly activity calendar.
- **Progression:** XP counter and level progress bar.
- **Badges:** Unlockable achievement badges with progress indicators.

### 5. **User Profile**
- Displays user stats, level progress, streak status, and bio.
- Personal gallery showcase displaying user-uploaded projects.

### 6. **Authentication & Navigation**
- **Auth Pages:** Login and Sign Up screens with JWT token persistence.
- **Layout:** Responsive navigation with a top header, desktop sidebar, and mobile bottom navigation bar.
- **Notifications:** Dropdown menu for recent activity and alerts.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Routing:** React Router v7
- **HTTP Client:** Axios (configured with auth token interceptors)
- **State Management:** React Context (`PostsContext`)

---

## 📁 Project Structure

```text
src/
├── api/          # Axios instance and API call functions
├── assets/       # Static assets and icons
├── components/   # Shared UI components (PostCard, PostBox, Header, Sidebar, Layout, etc.)
├── context/      # Application context providers (PostsProvider)
├── hooks/        # Custom hooks (usePosts)
├── pages/        # Route pages (HomePage, ExplorePage, CommunitiesPage, StreaksPage, ProfilePage, Auth)
└── types.ts      # TypeScript interfaces and data models
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Backend API server running on `http://localhost:8000` (optional for mock-only testing)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
