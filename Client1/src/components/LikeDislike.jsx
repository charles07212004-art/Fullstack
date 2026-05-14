import './LikeDislike.css';

const LikeDislike = ({ likes, dislikes, userLiked, onLike, onDislike }) => {
  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div className="like-dislike">
      <button 
        type="button"
        className={`like-btn ${userLiked === 'like' ? 'active' : ''}`}
        onClick={onLike}
        title="Like"
        aria-pressed={userLiked === 'like'}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 4.5l4 4v9.5H8V8.5L12 4.5m1-1.5L7 7v10.5h8V7l-2-2z" />
        </svg>
        <span>{formatCount(likes)}</span>
      </button>
      
      <button 
        type="button"
        className={`dislike-btn ${userLiked === 'dislike' ? 'active' : ''}`}
        onClick={onDislike}
        title="Dislike"
        aria-pressed={userLiked === 'dislike'}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 19.5l-4-4V5.5h8v9.5l-2 2m1 1.5l5-5V4.5H7v11.5l5 5z" />
        </svg>
        <span>{formatCount(dislikes)}</span>
      </button>
      
      <div className="divider"></div>
      
      <button type="button" className="share-btn" title="Share">
        <svg viewBox="0 0 24 24">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,11.81C7.5,11.31 6.79,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17C6.79,17 7.5,16.69 8.04,16.19L15.16,20.3C15.11,20.53 15.07,20.76 15.07,21A3,3 0 0,0 18,24A3,3 0 0,0 21,21A3,3 0 0,0 18,18Z" />
        </svg>
        <span>Share</span>
      </button>
      
      <button type="button" className="download-btn" title="Download">
        <svg viewBox="0 0 24 24">
          <path d="M19,13H5V7H19M19,3H5C3.9,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3Z" />
        </svg>
        <span>Download</span>
      </button>
    </div>
  );
};

export default LikeDislike;
