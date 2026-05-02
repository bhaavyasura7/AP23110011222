import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PriorityInbox from './pages/PriorityInbox';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow pt-24 pb-12">
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
