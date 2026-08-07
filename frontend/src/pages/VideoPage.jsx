import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, UserCircle, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './VideoPage.css';

const VideoPage = () => {
  const { id } = useParams();
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const [videoRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/videos/${id}`),
          axios.get(`http://localhost:5001/api/comments/video/${id}`)
        ]);
        setVideo(videoRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error('Error fetching video details', error);
      }
      setLoading(false);
    };
    fetchVideoData();
  }, [id]);

  const handleLike = async () => {
    if (!user) return alert('Please sign in to like videos');
    try {
      const { data } = await axios.put(`http://localhost:5001/api/videos/${id}/like`, {}, { headers: getAuthHeaders() });
      setVideo({ ...video, likes: data.likes });
    } catch (error) {
      console.error('Error liking video', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return alert('Please sign in to dislike videos');
    try {
      const { data } = await axios.put(`http://localhost:5001/api/videos/${id}/dislike`, {}, { headers: getAuthHeaders() });
      setVideo({ ...video, dislikes: data.dislikes });
    } catch (error) {
      console.error('Error disliking video', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const { data } = await axios.post(
        'http://localhost:5001/api/comments',
        { text: newComment, videoId: id },
        { headers: getAuthHeaders() }
      );
      // Fetch user details for the new comment immediately
      const newCommentWithUser = {
        ...data,
        userId: { _id: user._id, username: user.username, avatar: user.avatar }
      };
      setComments([newCommentWithUser, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;

    try {
      await axios.put(
        `http://localhost:5001/api/comments/${commentId}`,
        { text: editCommentText },
        { headers: getAuthHeaders() }
      );
      setComments(comments.map(c => c._id === commentId ? { ...c, text: editCommentText } : c));
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5001/api/comments/${commentId}`, { headers: getAuthHeaders() });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  if (loading) return <div className="loading">Loading video...</div>;
  if (!video) return <div className="error">Video not found</div>;

  return (
    <div className="video-page">
      <div className="video-player-section">
        <video className="video-player" controls src={video.videoUrl} poster={video.thumbnailUrl}></video>
        
        <h1 className="video-title">{video.title}</h1>
        
        <div className="video-metadata">
          <div className="channel-info">
            <img 
              src={video.channelId?.channelBanner || video.uploader?.avatar || 'https://ui-avatars.com/api/?name=Channel'} 
              alt="Channel" 
              className="channel-avatar-large" 
            />
            <div>
              <h3 className="channel-name">{video.channelId?.channelName || video.uploader?.username}</h3>
              <p className="subscribers">{video.channelId?.subscribers || 0} subscribers</p>
            </div>
            <button className="btn btn-primary subscribe-btn">Subscribe</button>
          </div>
          
          <div className="video-actions">
            <div className="like-dislike-group">
              <button className="action-btn" onClick={handleLike}>
                <ThumbsUp size={20} />
                <span>{video.likes}</span>
              </button>
              <div className="divider"></div>
              <button className="action-btn" onClick={handleDislike}>
                <ThumbsDown size={20} />
                <span>{video.dislikes}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="video-description">
          <p className="views-date">
            {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
          <p>{video.description}</p>
        </div>
        
        <div className="comments-section">
          <h3>{comments.length} Comments</h3>
          
          {user ? (
            <div className="add-comment">
              <img src={user.avatar} alt="User Avatar" className="avatar" />
              <form onSubmit={handleAddComment} className="comment-form">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="comment-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setNewComment('')}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>Comment</button>
                </div>
              </form>
            </div>
          ) : (
            <p>Please sign in to add a comment.</p>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <img src={comment.userId?.avatar || 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comment.userId?.username}</span>
                    <span className="comment-date">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  
                  {editingComment === comment._id ? (
                    <form onSubmit={(e) => handleUpdateComment(e, comment._id)} className="comment-form edit-form">
                      <input 
                        type="text" 
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        autoFocus
                      />
                      <div className="comment-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setEditingComment(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                      </div>
                    </form>
                  ) : (
                    <p className="comment-text">{comment.text}</p>
                  )}

                  {user && user._id === comment.userId?._id && !editingComment && (
                    <div className="comment-controls">
                      <button onClick={() => {
                        setEditingComment(comment._id);
                        setEditCommentText(comment.text);
                      }}><Edit size={16} /></button>
                      <button onClick={() => handleDeleteComment(comment._id)}><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="recommended-videos">
        {/* Recommended videos could go here */}
      </div>
    </div>
  );
};

export default VideoPage;
