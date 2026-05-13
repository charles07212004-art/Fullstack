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
        className={`like-btn ${userLiked === 'like' ? 'active' : ''}`}
        onClick={onLike}
        title="Like"
      >
        <svg viewBox="0 0 24 24">
          <path d="M18,4H15.5L16.1,2H3V13H5V6H18V4M19,13V6H21V13H19M19,15H21V16H19V15Z" />
        </svg>
        <span>{formatCount(likes)}</span>
      </button>
      
      <div className="divider"></div>
      
      <button 
        className={`dislike-btn ${userLiked === 'dislike' ? 'active' : ''}`}
        onClick={onDislike}
        title="Dislike"
      >
        <svg viewBox="0 0 24 24">
          <path d="M5,20H7.5L6.9,22H20V11H18V18H5V20M4,11V18H2V11H4M4,9H2V8H4V9Z" />
        </svg>
        <span>{formatCount(dislikes)}</span>
      </button>
      
      <button className="share-btn" title="Share">
        <svg viewBox="0 0 24 24">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,11.81C7.5,11.31 6.79,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17C6.79,17 7.5,16.69 8.04,16.19L15.16,20.3C15.11,20.53 15.07,20.76 15.07,21A3,3 0 0,0 18,24A3,3 0 0,0 21,21A3,3 0 0,0 18,18Z" />
        </svg>
        <span>Share</span>
      </button>
      
      <button className="download-btn" title="Download">
        <svg viewBox="0 0 24 24">
          <path d="M19,13H5V7H19M19,3H5C3.9,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3Z" />
        </svg>
        <span>Download</span>
      </button>
    </div>
  );
};

export default LikeDislike;
