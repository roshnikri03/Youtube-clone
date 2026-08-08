import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Mic, Video, Bell, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Query parameters make searches bookmarkable and let HomePage refetch filtered data.
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="logo-link">
          <img
            className="youtube-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="YouTube Logo"
          />
        </Link>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <Search size={20} />
          </button>
        </form>
        <button className="mic-btn">
          <Mic size={20} />
        </button>
      </div>

      <div className="header-right">
        {/* Authenticated and anonymous users receive different header actions. */}
        {user ? (
          <>
            <Link to="/channel/my-channel" className="icon-btn">
              <Video size={24} />
            </Link>
            <button className="icon-btn">
              <Bell size={24} />
            </button>
            <div className="user-profile">
              <img src={user.avatar} alt="Avatar" className="avatar" />
              <span className="username">{user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <Link to="/login" className="sign-in-btn">
            <UserCircle size={24} />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
