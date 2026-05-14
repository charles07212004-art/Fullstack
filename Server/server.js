const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const { videos: initialVideos, categories: initialCategories, comments: initialComments } = require('./data');

const app = express();
const port = process.env.PORT || 3000;
const VIDEOS_FILE = './videos.json';

let videos = [];
let categories = [];
let comments = [];

try {
  videos = initialVideos || [];
  categories = initialCategories || [];
  comments = initialComments || [];
} catch (e) {
  console.log('data.js not found, using empty');
}

let nextVideoId = videos.reduce((maxId, video) => Math.max(maxId, video.id || 0), 0) + 1;
let commentCounter = comments.reduce((maxId, comment) => Math.max(maxId, comment.id || 0), 0) + 1;

const loadVideos = async () => {
  try {
    const data = await fs.readFile(VIDEOS_FILE, 'utf8');
    videos = JSON.parse(data);
    nextVideoId = videos.reduce((maxId, video) => Math.max(maxId, video.id || 0), 0) + 1;
  } catch (e) {
    // use initial videos
  }
};

const saveVideos = async () => {
  try {
    await fs.writeFile(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  } catch (e) {
    console.error('Failed to save videos', e);
  }
};

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

app.delete('/api/comments/:id', (req, res) => {
  const commentId = Number(req.params.id);
  const index = comments.findIndex((comment) => comment.id === commentId);

  if (index === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  comments.splice(index, 1);
  res.status(204).end();
});

app.post('/api/videos', async (req, res) => {
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
  await saveVideos();
  res.status(201).json(newVideo);
});

const startServer = async () => {
  await loadVideos();
  const server = app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other process or use a different PORT.`);
      process.exit(1);
    }
    throw err;
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };

