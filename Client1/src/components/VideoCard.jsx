import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';
import { extractYouTubeId, isYouTubeUrl } from '../utils/youtube';

// const formatViews = (views) => {
//   const count = parseInt(views) || 0;
//   if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
//   if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
//   return count.toString();
// };

const isVideoFile = (url) => /\.(mp4|webm|ogg|mov|mkv|avi|flv|mpeg|mpg)(\?.*)?$/i.test(url);

const getYouTubeVideoId = (url) => extractYouTubeId(url);
const isYouTubeVideo = (url) => isYouTubeUrl(url);
const getYouTubePreview = (url) => {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
  // Keep preview lightweight + only autoplay via hover.
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1&origin=${origin}&iv_load_policy=3&disablekb=1&showinfo=0`;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const parseDuration = (duration) => {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(duration) || 0;
};

const VideoCard = ({ video, onDelete, isSelected, onSelect, isSelectionMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewMuted, setPreviewMuted] = useState(false);
  const [previewRemaining, setPreviewRemaining] = useState(video.duration || '0:00');
  const [previewDuration, setPreviewDuration] = useState(video.duration || '0:00');
  const [previewTotalSeconds, setPreviewTotalSeconds] = useState(parseDuration(video.duration || '0:00'));
  const [loadedDuration, setLoadedDuration] = useState(video.duration || '0:00');
  const previewRef = useRef(null);
  const isUploaded = Boolean(video.isUploaded);
  const showVideoPreview = isHovered && (isVideoFile(video.videoUrl) || isYouTubeVideo(video.videoUrl));

  useEffect(() => {
    if (showVideoPreview && previewRef.current && previewRef.current.tagName === 'VIDEO') {
      const videoElement = previewRef.current;
      videoElement.muted = previewMuted;
      videoElement.volume = previewMuted ? 0 : 0.75;
      videoElement.currentTime = 0;

      const playPromise = videoElement.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          videoElement.muted = true;
          setPreviewMuted(true);
          // Try again once muted; ignore failures to prevent console spam.
          videoElement.play().catch(() => {});
        });
      }
    }
  }, [showVideoPreview, previewMuted]);

  useEffect(() => {
    if ((video.duration === '0:00' || !video.duration) && isVideoFile(video.videoUrl)) {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.crossOrigin = 'anonymous';
      videoEl.style.display = 'none';
      document.body.appendChild(videoEl);

      const onLoaded = () => {
        const mins = Math.floor(videoEl.duration / 60);
        const secs = Math.floor(videoEl.duration % 60);
        const dur = `${mins}:${secs.toString().padStart(2, '0')}`;
        setLoadedDuration(dur);
        document.body.removeChild(videoEl);
      };

      const onError = () => {
        document.body.removeChild(videoEl);
      };

      videoEl.addEventListener('loadedmetadata', onLoaded);
      videoEl.addEventListener('error', onError);
      videoEl.src = video.videoUrl;
    }
  }, [video.duration, video.videoUrl]);

  const handlePreviewTimeUpdate = (event) => {
    const currentSeconds = Math.floor(event.target.currentTime || 0);
    const totalSeconds = previewTotalSeconds || Math.floor(event.target.duration || 0);
    const remaining = totalSeconds > 0 ? Math.max(0, totalSeconds - currentSeconds) : 0;
    setPreviewTotalSeconds(totalSeconds);
    setPreviewDuration(formatTime(totalSeconds));
    setPreviewRemaining(totalSeconds > 0 ? formatTime(remaining) : video.duration || '0:00');
  };

  const handleDurationUpdate = (event) => {
    const totalSeconds = Math.floor(event.target.duration || 0);
    if (totalSeconds > 0) {
      const formatted = formatTime(totalSeconds);
      setPreviewDuration(formatted);
      setPreviewTotalSeconds(totalSeconds);
      setPreviewRemaining(formatted);
    }
  };

  return (
    <div className={`video-card ${isSelected ? 'selected' : ''}`}>
      {isSelectionMode && isUploaded && (
        <div className="video-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(video.id, e.target.checked)}
          />
        </div>
      )}
      <div
        className="video-thumbnail-link-wrapper"
        onMouseEnter={() => {
          setPreviewMuted(false);
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/watch/${video.id}`}
          className="video-thumbnail-link"
        >
          <div className="video-thumbnail">
          {showVideoPreview ? (
            isVideoFile(video.videoUrl) ? (
              <video
                ref={previewRef}
                src={video.videoUrl}
                className="video-preview"
                muted={previewMuted}
                // Avoid autoplay issues; preview starts via hover state.
                autoPlay={false}
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={handleDurationUpdate}
                onLoadedData={handleDurationUpdate}
                onDurationChange={handleDurationUpdate}
                onTimeUpdate={handlePreviewTimeUpdate}
              />
            ) : (
              <iframe
                ref={previewRef}
                title={`preview-${video.id}`}
                src={getYouTubePreview(video.videoUrl)}
                className="video-preview"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <img src={video.thumbnail} alt={video.title} />
          )}
          <div className="preview-overlay">
            <span className="preview-play-icon">▶</span>
          </div>
          <div className="video-duration">
            {showVideoPreview && isVideoFile(video.videoUrl)
              ? `${previewRemaining} / ${previewDuration}`
              : loadedDuration || video.duration || '0:00'}
          </div>
        </div>
      </Link>
      </div>

      <div className="video-info">
        <div className="channel-avatar">
          <img src={video.channelAvatar} alt={video.channel} />
        </div>

        <div className="video-details">
          <Link to={`/watch/${video.id}`} className="video-title">
            {video.title}
          </Link>
          <Link to={`/channel/${video.channel}`} className="channel-name">
            {video.channel}
          </Link>
          <div className="video-stats">
            <span>{video.views} views</span>
            <span>•</span>
            <span>{video.timestamp}</span>
          </div>
        </div>
        {isUploaded && onDelete && !isSelectionMode && (
          <button className="delete-btn" onClick={() => onDelete(video.id)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
