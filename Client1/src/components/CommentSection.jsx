import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentItem from './CommentItem';
import api from '../api/axios';
import './CommentSection.css';

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/comments?videoId=${videoId}`);
        setComments(data);
      } catch (e) {
        console.error('Failed to load comments:', e);
      }
    };
    load();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const payload = {
      videoId,
      author: user?.name || 'You',
      text: newComment,
    };

    try {
      const { data: created } = await api.post('/comments', payload);
      // backend already returns timestamp: 'Just now'
      setComments((prev) => [
        { ...created, avatar: user?.avatar || 'https://picsum.photos/32/32?random=99', likes: 0, replies: 0 },
        ...prev
      ]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };


  return (
    <div className="comment-section">
      <div className="comments-header">
        <h3>{comments.length} Comments</h3>
      </div>

      <form className="add-comment" onSubmit={handleAddComment}>
        <img 
          src={user?.avatar || 'https://picsum.photos/32/32?random=99'} 
          alt={user?.name ? `${user.name}'s avatar` : 'Your avatar'} 
          className="user-avatar" 
        />
        <div className="comment-input-wrapper">
          <textarea
            rows="2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment(e);
              }
            }}
            className="comment-input"
          />
          {newComment.trim() && (
            <div className="comment-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setNewComment('')}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
