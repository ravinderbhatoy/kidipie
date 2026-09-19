import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PostsProvider } from './context/PostsProvider';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CommunitiesPage from './pages/CommunitiesPage';
import StreaksPage from './pages/StreaksPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './Auth/LoginPage';
import SignUpPage from './Auth/SignUpPage';
import ProtectedRoute from './Auth/ProtectedRoute';

function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* Main App Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="communities" element={<CommunitiesPage />} />
              <Route path="streaks" element={<StreaksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  );
}

export default App;
