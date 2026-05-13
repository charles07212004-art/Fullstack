const STORAGE_KEY = 'thundertube_uploaded_videos';
const METRICS_KEY = 'thundertube_video_metrics';
const SUBSCRIPTIONS_KEY = 'thundertube_subscriptions';
const HISTORY_KEY = 'thundertube_history';
const COMMENTS_KEY = 'thundertube_comments';

export const loadUploadedVideos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load uploaded videos:', error);
    return [];
  }
};

export const saveUploadedVideos = (videos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Failed to save uploaded videos:', error);
  }
};

export const addUploadedVideo = (video) => {
  const saved = loadUploadedVideos();
  const normalizedUrl = video.videoUrl?.trim() || '';
  const idx = saved.findIndex((item) =>
    String(item.id) === String(video.id) || item.videoUrl?.trim() === normalizedUrl
  );

  if (idx !== -1) {
    const next = [...saved];
    next[idx] = video;
    saveUploadedVideos(next);
    return;
  }

  saveUploadedVideos([...saved, video]);
};

export const removeUploadedVideo = (id) => {
  const saved = loadUploadedVideos();
  saveUploadedVideos(saved.filter((video) => String(video.id) !== String(id)));
};

export const clearAllUploadedVideos = () => {
  saveUploadedVideos([]);
};

const getRandomImage = () => `https://picsum.photos/320/180?random=${Date.now() % 1000}`;

const getYouTubeThumbnail = (url) => {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
};

export const getVideoThumbnail = (videoUrl, customThumbnailUrl) => {
  if (customThumbnailUrl) return customThumbnailUrl;
  const ytThumbnail = getYouTubeThumbnail(videoUrl);
  if (ytThumbnail) return ytThumbnail;
  return getRandomImage();
};

const getLocalStorageJson = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load storage key ${key}:`, error);
    return defaultValue;
  }
};

const saveLocalStorageJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save storage key ${key}:`, error);
  }
};

export const loadVideoMetrics = () => getLocalStorageJson(METRICS_KEY, {});

export const saveVideoMetrics = (metrics) => saveLocalStorageJson(METRICS_KEY, metrics);

export const getVideoMetrics = (id) => {
  const metrics = loadVideoMetrics();
  return metrics[String(id)] || { views: 0, likes: 0, dislikes: 0, userLiked: null };
};

export const updateVideoMetrics = (id, updater) => {
  const metrics = loadVideoMetrics();
  const current = metrics[String(id)] || { views: 0, likes: 0, dislikes: 0, userLiked: null };
  const updated = updater({ ...current });
  metrics[String(id)] = updated;
  saveVideoMetrics(metrics);
  return updated;
};

export const applyVideoMetrics = (video) => {
  if (!video) return video;
  const metrics = getVideoMetrics(video.id);
  return {
    ...video,
    views: metrics.views !== undefined ? metrics.views : video.views,
    likes: metrics.likes !== undefined ? metrics.likes : video.likes || 0,
    dislikes: metrics.dislikes !== undefined ? metrics.dislikes : video.dislikes || 0,
  };
};

export const applyMetricsToVideos = (videos) => videos.map(applyVideoMetrics);

export const incrementVideoViews = (id) => {
  updateVideoMetrics(id, (current) => ({
    ...current,
    views: (parseInt(current.views, 10) || 0) + 1,
  }));

  const saved = loadUploadedVideos();
  const video = saved.find((v) => String(v.id) === String(id));
  if (video) {
    video.views = (parseInt(video.views, 10) || 0) + 1;
    saveUploadedVideos(saved);
  }

  return getVideoMetrics(id).views;
};

export const toggleVideoLike = (id, type) => {
  return updateVideoMetrics(id, (current) => {
    const liked = current.userLiked === 'like';
    const disliked = current.userLiked === 'dislike';
    let likes = parseInt(current.likes, 10) || 0;
    let dislikes = parseInt(current.dislikes, 10) || 0;
    let userLiked = current.userLiked;

    if (type === 'like') {
      if (liked) {
        likes = Math.max(0, likes - 1);
        userLiked = null;
      } else {
        likes += 1;
        if (disliked) {
          dislikes = Math.max(0, dislikes - 1);
        }
        userLiked = 'like';
      }
    }

    if (type === 'dislike') {
      if (disliked) {
        dislikes = Math.max(0, dislikes - 1);
        userLiked = null;
      } else {
        dislikes += 1;
        if (liked) {
          likes = Math.max(0, likes - 1);
        }
        userLiked = 'dislike';
      }
    }

    return {
      ...current,
      likes,
      dislikes,
      userLiked,
    };
  });
};

export const loadSubscriptions = () => getLocalStorageJson(SUBSCRIPTIONS_KEY, []);

export const isSubscribedToChannel = (channel) => {
  const subscriptions = loadSubscriptions();
  return subscriptions.includes(channel);
};

export const toggleSubscription = (channel) => {
  const subscriptions = loadSubscriptions();
  const index = subscriptions.indexOf(channel);
  const next = [...subscriptions];

  if (index !== -1) {
    next.splice(index, 1);
  } else {
    next.unshift(channel);
  }

  saveLocalStorageJson(SUBSCRIPTIONS_KEY, next);
  return index === -1;
};

export const loadHistory = () => getLocalStorageJson(HISTORY_KEY, []);

export const saveHistory = (history) => saveLocalStorageJson(HISTORY_KEY, history);

export const addToWatchHistory = (video) => {
  const history = loadHistory();
  const entry = {
    id: String(video.id),
    title: video.title,
    thumbnail: video.thumbnail,
    channel: video.channel,
    duration: video.duration || '0:00',
    views: video.views || 0,
    channelAvatar: video.channelAvatar,
    watchedAt: new Date().toISOString(),
  };

  const next = [entry, ...history.filter((item) => String(item.id) !== String(video.id))].slice(0, 50);
  saveHistory(next);
};

export const loadComments = (videoId) => getLocalStorageJson(`${COMMENTS_KEY}_${videoId}`, []);

export const saveComments = (videoId, comments) => saveLocalStorageJson(`${COMMENTS_KEY}_${videoId}`, comments);

export const getVideoDuration = (videoUrl) => {
  return new Promise((resolve) => {
    // For YouTube videos, we cannot reliably extract duration without API access.
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      resolve('0:00');
      return;
    }

    if (/\.(mp4|webm|ogg|mov|m4v|avi|flv|mpeg|mpg)(\?.*)?$/i.test(videoUrl)) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.style.display = 'none';
      document.body.appendChild(video);

      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('error', onError);
        document.body.removeChild(video);
      };

      const onLoaded = () => {
        const mins = Math.floor(video.duration / 60);
        const secs = Math.floor(video.duration % 60);
        cleanup();
        resolve(`${mins}:${secs.toString().padStart(2, '0')}`);
      };

      const onError = () => {
        cleanup();
        resolve('0:00');
      };

      video.addEventListener('loadedmetadata', onLoaded);
      video.addEventListener('error', onError);
      video.src = videoUrl;
    } else {
      resolve('0:00');
    }
  });
};

export const createUploadedVideo = async ({ title, description, category, channel, videoUrl, thumbnailUrl }) => {
  const duration = await getVideoDuration(videoUrl);
  const thumbnail = getVideoThumbnail(videoUrl, thumbnailUrl);

  // Use a unique id per upload. Avoid Date.now() collisions when uploading quickly.
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return {
    id,
    title,
    description,
    category,
    channel,
    channelAvatar: 'https://picsum.photos/40/40?random=99',
    thumbnail,
    videoUrl,
    views: 0,
    likes: 0,
    dislikes: 0,
    timestamp: 'Just uploaded',
    duration: duration || '0:00',
    isUploaded: true
  };
};

export const removeMultipleUploadedVideos = (ids) => {
  const saved = loadUploadedVideos();
  saveUploadedVideos(saved.filter((video) => !ids.includes(String(video.id))));
};

export const getUploadedVideoById = (id) => {
  const videos = loadUploadedVideos();
  return videos.find((video) => String(video.id) === String(id));
};

export const incrementVideoViewsForUploaded = (id) => {
  const saved = loadUploadedVideos();
  const video = saved.find((v) => String(v.id) === String(id));
  if (video) {
    video.views = (parseInt(video.views, 10) || 0) + 1;
    saveUploadedVideos(saved);
  }
};
