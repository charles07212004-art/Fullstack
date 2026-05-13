import VideoCard from './VideoCard';
import './VideoGrid.css';

const VideoGrid = ({ videos = [], onDelete, selectedVideos = [], onSelectVideo, isSelectionMode }) => {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onDelete={onDelete}
          isSelected={selectedVideos.includes(video.id)}
          onSelect={onSelectVideo}
          isSelectionMode={isSelectionMode}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
