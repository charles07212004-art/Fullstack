import { useState } from 'react';
import './CommentItem.css';

const CommentItem = ({ comment, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(comment.id);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="comment-item">
      <img 
        src={comment.avatar} 
        alt={comment.author} 
        className="comment-avatar" 
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.author}</span>
          <span className="comment-timestamp">{comment.timestamp}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
        <div className="comment-actions">
          <button 
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            👍
            {likes > 0 && <span className="like-count">{formatCount(likes)}</span>}
          </button>
          <button className="dislike-btn">
            👎
          </button>
          <button type="button" className="delete-comment-btn" onClick={handleDelete}>
            Delete
          </button>
          <button className="reply-btn">
            Reply
          </button>
        </div>
        {comment.replies > 0 && (
          <button 
            className="show-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? '↑ Hide' : '→'} {comment.replies} replies
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
