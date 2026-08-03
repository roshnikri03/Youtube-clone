import { NavLink } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, User } from 'lucide-react';
import './Sidebar.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);

  const mainLinks = [
    { name: 'Home', icon: <Home size={24} />, path: '/' },
    { name: 'Shorts', icon: <Compass size={24} />, path: '/shorts' },
    { name: 'Subscriptions', icon: <PlaySquare size={24} />, path: '/subscriptions' },
  ];

  const secondaryLinks = [
    { name: 'You', icon: <User size={24} />, path: '/channel/my-channel' },
    { name: 'History', icon: <History size={24} />, path: '/history' },
    { name: 'Watch later', icon: <Clock size={24} />, path: '/watch-later' },
    { name: 'Liked videos', icon: <ThumbsUp size={24} />, path: '/liked' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-section">
        {mainLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            {link.icon}
            <span className="link-text">{link.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-divider"></div>

      <div className="sidebar-section">
        <h3 className="sidebar-subtitle">You</h3>
        {secondaryLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
          >
            {link.icon}
            <span className="link-text">{link.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-divider"></div>

      {!user && (
        <div className="sidebar-section auth-section">
          <p>Sign in to like videos, comment, and subscribe.</p>
          <NavLink to="/login" className="sign-in-btn mt-2">
            <User size={24} />
            Sign in
          </NavLink>
          <div className="sidebar-divider"></div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
