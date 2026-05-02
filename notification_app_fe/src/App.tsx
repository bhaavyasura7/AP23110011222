import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PriorityInbox from './pages/PriorityInbox';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/priority" element={<PriorityInbox />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
