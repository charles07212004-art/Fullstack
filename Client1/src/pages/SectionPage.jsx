import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './Page.css';

const SectionPage = ({ title, subtitle }) => {
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
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </main>
      </div>
    </div>
  );
};

export default SectionPage;
