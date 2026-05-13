import { useState } from 'react';
import { addUploadedVideo, createUploadedVideo } from '../utils/videoStorage';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import './Page.css';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    channel: '',
    videoUrl: '',
    thumbnailUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('success');

    try {
      const preparedVideo = await createUploadedVideo(formData);
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        channel: formData.channel,
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        duration: preparedVideo.duration
      };

      let savedVideo;
      try {
        const { data } = await api.post('/videos', payload);
        savedVideo = { ...data, isUploaded: true };
      } catch (backendError) {
        console.warn('Backend upload failed, saving locally instead:', backendError);
        savedVideo = preparedVideo;
      }

      addUploadedVideo(savedVideo);
      setMessage('Video uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        channel: '',
        videoUrl: '',
        thumbnailUrl: ''
      });
    } catch (error) {
      setMessageType('error');
      setMessage('Failed to upload video. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <h1>Upload Video</h1>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="News">News</option>
                <option value="Sports">Sports</option>
                <option value="Education">Education</option>
                <option value="Comedy">Comedy</option>
                <option value="Film & Animation">Film & Animation</option>
                <option value="Howto & Style">Howto & Style</option>
                <option value="Science & Technology">Science & Technology</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="channel">Channel Name</label>
              <input
                type="text"
                id="channel"
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="videoUrl">Video URL</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="Paste video link here"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="thumbnailUrl">Custom Thumbnail URL (optional)</label>
              <input
                type="url"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="Paste thumbnail image URL here"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
            {message && <p className={`message ${messageType === 'error' ? 'error' : 'success'}`}>{message}</p>}
          </form>
        </main>
      </div>
    </div>
  );
};

export default Upload;
