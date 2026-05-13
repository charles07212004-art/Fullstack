import { useState, useRef } from 'react';
import './VideoPlayer.css';
import { extractYouTubeId, getYouTubeEmbedUrl, isYouTubeUrl } from '../utils/youtube';

const isVideoFile = (url) => /\.(mp4|webm|ogg|mov|mkv|avi|flv|mpeg|mpg)(\?.*)?$/i.test(url);

const formatTime = (time) => {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const VideoPlayer = ({ video }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const videoRef = useRef(null);
  const youtubeId = video.videoUrl ? extractYouTubeId(video.videoUrl) : null;
  const embedUrl = youtubeId ? getYouTubeEmbedUrl(youtubeId) : null;
  const showEmbed = embedUrl && isYouTubeUrl(video.videoUrl);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setTotalTime(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const timeLabel = totalTime > 0 ? `${formatTime(currentTime)} / ${formatTime(totalTime)}` : (video.duration ? String(video.duration) : '--:--');

  return (
    <div className="video-player">
      <div className="video-container video-embed-container">
        {showEmbed ? (
          <iframe
            src={`${embedUrl}?rel=0&modestbranding=1&playsinline=1&controls=0&autoplay=1&mute=0`}
            title={video.title}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write; fullscreen"
            allowFullScreen
          />
        ) : isVideoFile(video.videoUrl) ? (
          <video
            ref={videoRef}
            controls
            muted={false}
            autoPlay
            playsInline
            src={video.videoUrl}
            className="video-iframe"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <div className="external-video-link">
            <a href={video.videoUrl} target="_blank" rel="noreferrer">
              Open video link
            </a>
          </div>
        )}
      </div>
      <div className="video-controls">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: totalTime > 0 ? `${(currentTime / totalTime) * 100}%` : '0%' }}></div>
        </div>
        <div className="controls">
          <button className="control-btn">
            <svg viewBox="0 0 24 24">
              <path d="M8,5V19L19,12L8,5Z" />
            </svg>
          </button>
          <button className="control-btn">
            <svg viewBox="0 0 24 24">
              <path d="M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z" />
            </svg>
          </button>
          <span className="time">{timeLabel}</span>
          <div className="spacer"></div>
          <button className="control-btn">
            <svg viewBox="0 0 24 24">
              <path d="M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
          </button>
          <button className="control-btn">
            <svg viewBox="0 0 24 24">
              <path d="M7,14H5V12H7V14M12,14H10V12H12V14M19,14H17V12H19V14M7,19H5V17H7V19M12,19H10V17H12V19M19,19H17V17H19V19M7,9H5V7H7V9M12,9H10V7H12V9M19,9H17V7H19V9Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
