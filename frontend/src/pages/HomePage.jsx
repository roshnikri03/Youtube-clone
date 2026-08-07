import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import { formatDistanceToNow } from 'date-fns';

const categories = [
  'All',
  'Web Development',
  'JavaScript',
  'React',
  'Node.js',
  'Music',
  'Gaming',
  'News',
];

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5001/api/videos';
        const params = [];
        if (searchTerm) params.push(`keyword=${searchTerm}`);
        if (selectedCategory !== 'All') params.push(`category=${selectedCategory}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const { data } = await axios.get(url);
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos', error);
      }
      setLoading(false);
    };

    fetchVideos();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="home-page">
      <div className="categories-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : (
        <div className="video-grid">
          {videos.length === 0 ? (
            <div className="no-videos">No videos found.</div>
          ) : (
            videos.map((video) => (
              <Link to={`/video/${video._id}`} key={video._id} className="video-card">
                <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
                <div className="video-info-container">
                  <img
                    src={video.channelId?.channelBanner || video.uploader?.avatar || 'https://ui-avatars.com/api/?name=Channel'}
                    alt="Channel Avatar"
                    className="channel-avatar"
                  />
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="channel-name">{video.channelId?.channelName || video.uploader?.username}</p>
                    <p className="video-stats">
                      {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
