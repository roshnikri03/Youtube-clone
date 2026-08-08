import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ChannelPage from './pages/ChannelPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPage from './pages/VideoPage';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const isWatchPage = pathname.startsWith('/video/');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container">
        <Header toggleSidebar={toggleSidebar} />
        <div className="main-content">
          {!isWatchPage && <Sidebar isOpen={sidebarOpen} />}
          <main className={`page-content ${isWatchPage ? 'video-page-content' : (sidebarOpen ? 'sidebar-open' : 'sidebar-closed')}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shorts" element={<HomePage />} />
              <Route path="/subscriptions" element={<HomePage />} />
              <Route path="/channel/my-channel" element={<ChannelPage />} />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;