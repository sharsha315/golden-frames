import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import AlbumView from './pages/AlbumView';
import Compilations from './pages/Compilations';
import CompilationView from './pages/CompilationView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/album/:id" element={<AlbumView />} />
            <Route path="/compilations" element={<Compilations />} />
            <Route path="/compilation/:id" element={<CompilationView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;