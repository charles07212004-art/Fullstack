const videos = [
  {
    id: 1,
    title: 'Big Surf Adventure',
    description: 'A thrilling surf session with beautiful coastal views and expert tips for catching the perfect wave.',
    category: 'Sports',
    channel: 'WaveRider',
    channelAvatar: 'https://picsum.photos/40/40?random=21',
    thumbnail: 'https://img.youtube.com/vi/ysz5S6PUM-U/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    views: '1.2M',
    timestamp: '2 days ago',
    duration: '5:32'
  },
  {
    id: 2,
    title: 'Home Workout Routine',
    description: 'Simple home exercises you can do without equipment for a stronger, healthier body.',
    category: 'Education',
    channel: 'FitLife',
    channelAvatar: 'https://picsum.photos/40/40?random=22',
    thumbnail: 'https://img.youtube.com/vi/3fumBcKC6RE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3fumBcKC6RE',
    views: '842K',
    timestamp: '1 week ago',
    duration: '8:14'
  },
  {
    id: 3,
    title: 'Top Gaming Moments',
    description: 'The best play highlights and epic wins from the latest gaming tournaments.',
    category: 'Gaming',
    channel: 'GameZone',
    channelAvatar: 'https://picsum.photos/40/40?random=23',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: '3.4M',
    timestamp: '3 days ago',
    duration: '12:07'
  },
  {
    id: 4,
    title: 'Fun Comedy Sketches',
    description: 'A compilation of funny sketches and short performances that will make you laugh out loud.',
    category: 'Comedy',
    channel: 'LaughLab',
    channelAvatar: 'https://picsum.photos/40/40?random=24',
    thumbnail: 'https://img.youtube.com/vi/e-ORhEE9VVg/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=e-ORhEE9VVg',
    views: '2.1M',
    timestamp: '5 days ago',
    duration: '9:20'
  }
];


const categories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Comedy",
  "Film & Animation",
  "Howto & Style",
  "Science & Technology",
  "Travel"
];

const comments = [
  { id: 1, videoId: 1, author: "Alex", text: "This documentary is amazing!", timestamp: "3 hours ago" },
  { id: 2, videoId: 2, author: "Jordan", text: "I tried this recipe and it turned out great.", timestamp: "1 day ago" },
  { id: 3, videoId: 4, author: "Taylor", text: "I laughed so hard at the cat jokes.", timestamp: "2 hours ago" }
];

module.exports = {
  videos,
  categories,
  comments
};
