import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import SearchResults from './pages/SearchResults';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import EditVideo from './pages/EditVideo';
import SectionPage from './pages/SectionPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/trending" element={<SectionPage title="Trending" subtitle="Watch the hottest trending videos now." />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/library" element={<SectionPage title="Library" subtitle="Your saved videos and playlists appear here." />} />
          <Route path="/history" element={<History />} />
          <Route path="/gaming" element={<SectionPage title="Gaming" subtitle="Gaming highlights and clips." />} />
          <Route path="/music" element={<SectionPage title="Music" subtitle="Music videos and playlists." />} />
          <Route path="/sports" element={<SectionPage title="Sports" subtitle="Live sports videos and highlights." />} />
          <Route path="/news" element={<SectionPage title="News" subtitle="Latest news videos and reports." />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit/:id" element={<EditVideo />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
