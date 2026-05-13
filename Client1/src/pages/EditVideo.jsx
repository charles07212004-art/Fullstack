import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EditVideo = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="page-content">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`page-main ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <h1>Edit Video</h1>
          <p>Edit your video details.</p>
        </main>
      </div>
    </div>
  );
};

export default EditVideo;
