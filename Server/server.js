const express = require('express');
const cors = require('cors');
const { videos, categories, comments } = require('./data');

const app = express();
const port = process.env.PORT || 4000;
let nextVideoId = videos.reduce((maxId, video) => Math.max(maxId, video.id || 0), 0) + 1;
let commentCounter = comments.reduce((maxId, comment) => Math.max(maxId, comment.id || 0), 0) + 1;

const getYouTubeThumbnail = (url) => {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/i);
  return ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` : null;
};

const getVideoThumbnail = (videoUrl, thumbnailUrl) => {
  if (thumbnailUrl) return thumbnailUrl;
  const youtubeThumbnail = getYouTubeThumbnail(videoUrl);
  return youtubeThumbnail || `https://picsum.photos/320/180?random=${Date.now()}`;
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api', (req, res) => {
  res.json({ message: 'Backend is running', version: '1.0.0' });
});

app.get('/api/videos', (req, res) => {
  const search = req.query.q?.toLowerCase() || '';
  const category = req.query.category || 'All';

  let result = videos;

  if (category !== 'All') {
    result = result.filter((video) => video.category === category);
  }

  if (search) {
    result = result.filter((video) =>
      video.title.toLowerCase().includes(search) ||
      video.channel.toLowerCase().includes(search) ||
      video.description.toLowerCase().includes(search)
    );
  }

  res.json(result);
});

app.get('/api/videos/:id', (req, res) => {
  const id = Number(req.params.id);
  const video = videos.find((item) => item.id === id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.json(video);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/comments', (req, res) => {
  const videoId = Number(req.query.videoId);
  const result = Number.isNaN(videoId)
    ? comments
    : comments.filter((comment) => comment.videoId === videoId);

  res.json(result);
});

app.post('/api/comments', (req, res) => {
  const { videoId, author, text } = req.body;


  if (!videoId || !author || !text) {
    return res.status(400).json({ error: 'videoId, author, and text are required' });
  }

  const newComment = {
    id: commentCounter++,
    videoId,
    author,
    text,
    timestamp: 'Just now'
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

app.post('/api/videos', (req, res) => {
  const { title, description, category, channel, channelAvatar, videoUrl, thumbnailUrl, duration } = req.body;


  if (!title || !description || !category || !channel || !videoUrl) {
    return res.status(400).json({ error: 'title, description, category, channel, and videoUrl are required' });
  }

  const newVideo = {
    id: nextVideoId++,
    title,
    description,
    category,
    channel,
    channelAvatar: channelAvatar || 'https://picsum.photos/40/40?random=99',
    thumbnail: getVideoThumbnail(videoUrl, thumbnailUrl),
    videoUrl,
    views: '0',
    timestamp: 'Just uploaded',
    duration: duration || '0:00',
    isUploaded: true
  };

  videos.push(newVideo);
  res.status(201).json(newVideo);
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
