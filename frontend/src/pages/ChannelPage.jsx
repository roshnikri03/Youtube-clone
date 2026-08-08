import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import './ChannelPage.css';

const ChannelPage = () => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  
  // Video Form State
  const [videoForm, setVideoForm] = useState({ id: null, title: '', description: '', videoFile: null, thumbnailFile: null, category: 'Web Development' });

  useEffect(() => {
    const fetchChannel = async () => {
      if (!user) return setLoading(false);
      try {
        const { data } = await axios.get('http://localhost:5001/api/channels/my-channel', { headers: getAuthHeaders() });
        setChannel(data);
      } catch (error) {
        console.log('User has no channel yet or error occurred');
      }
      setLoading(false);
    };
    fetchChannel();
  }, [user]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5001/api/channels', { channelName }, { headers: getAuthHeaders() });
      setChannel(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating channel', error);
      alert(error.response?.data?.message || 'Error creating channel');
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', videoForm.title);
      formData.append('description', videoForm.description);
      formData.append('category', videoForm.category);
      if (videoForm.videoFile) formData.append('video', videoForm.videoFile);
      if (videoForm.thumbnailFile) formData.append('thumbnail', videoForm.thumbnailFile);

      if (videoForm.id) {
        const { data } = await axios.put(`http://localhost:5001/api/videos/${videoForm.id}`, formData, { 
          headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } 
        });
        setChannel({ ...channel, videos: channel.videos.map(v => v._id === videoForm.id ? data : v) });
      } else {
        const { data } = await axios.post('http://localhost:5001/api/videos', formData, { 
          headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' } 
        });
        setChannel({ ...channel, videos: [...channel.videos, data] });
      }
      setShowVideoModal(false);
    } catch (error) {
      console.error('Error saving video', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`http://localhost:5001/api/videos/${videoId}`, { headers: getAuthHeaders() });
        setChannel({ ...channel, videos: channel.videos.filter(v => v._id !== videoId) });
      } catch (error) {
        console.error('Error deleting video', error);
      }
    }
  };

  const openVideoModal = (video = null) => {
    if (video) {
      setVideoForm({ id: video._id, title: video.title, description: video.description, videoFile: null, thumbnailFile: null, category: video.category });
    } else {
      setVideoForm({ id: null, title: '', description: '', videoFile: null, thumbnailFile: null, category: 'Web Development' });
    }
    setShowVideoModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) return <div className="auth-required">Please sign in to view your channel.</div>;

  if (!channel) {
    return (
      <div className="no-channel-container">
        <h2>You don't have a channel yet</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Create Channel</button>

        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setShowCreateModal(false)}><X /></button>
              <h2>How you'll appear</h2>
              <form onSubmit={handleCreateChannel} className="channel-form">
                <img src={user.avatar} alt="Profile" className="preview-avatar" />
                <input 
                  type="text" 
                  placeholder="Channel Name" 
                  required 
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Create channel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="channel-page">
      <div className="channel-header">
        <img src={channel.channelBanner} alt="Banner" className="channel-banner" />
        <div className="channel-info-row">
          <img src={user.avatar} alt="Avatar" className="channel-avatar-huge" />
          <div className="channel-details">
            <h1>{channel.channelName}</h1>
            <p>
              {user.username} • {channel.subscribers} subscribers • {channel.videos.length} videos
            </p>
            <p className="channel-desc">{channel.description}</p>
          </div>
          <button className="btn btn-primary manage-btn" onClick={() => openVideoModal()}>
            <Plus size={20} /> Upload Video
          </button>
        </div>
      </div>

      <div className="channel-nav">
        <div className="nav-item active">Home</div>
        <div className="nav-item">Videos</div>
        <div className="nav-item">Playlists</div>
      </div>

      <div className="channel-content">
        <h3>Videos</h3>
        {channel.videos.length === 0 ? (
          <p className="no-content">No videos uploaded yet.</p>
        ) : (
          <div className="video-grid">
            {channel.videos.map(video => (
              <div key={video._id} className="channel-video-card">
                <Link to={`/video/${video._id}`}>
                  <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
                </Link>
                <div className="card-info">
                  <h4 className="video-title">{video.title}</h4>
                  <p className="video-stats">
                    {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                  </p>
                  <div className="card-actions">
                    <button onClick={() => openVideoModal(video)} className="btn-icon"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteVideo(video._id)} className="btn-icon text-danger"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showVideoModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowVideoModal(false)}><X /></button>
            <h2>{videoForm.id ? 'Edit Video' : 'Upload Video'}</h2>
            <form onSubmit={handleVideoSubmit} className="video-form">
              <input type="text" placeholder="Title" required value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} />
              <textarea placeholder="Description" rows="3" value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})}></textarea>
              <label>Video File (MP4 etc)</label>
              <input type="file" accept="video/*" onChange={e => setVideoForm({...videoForm, videoFile: e.target.files[0]})} required={!videoForm.id} />
              <label>Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={e => setVideoForm({...videoForm, thumbnailFile: e.target.files[0]})} required={!videoForm.id} />
              <select value={videoForm.category} onChange={e => setVideoForm({...videoForm, category: e.target.value})} required>
                <option value="Web Development">Web Development</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="News">News</option>
              </select>
              <button type="submit" className="btn btn-primary">{videoForm.id ? 'Save Changes' : 'Upload'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
