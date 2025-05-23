import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import PhotoGrid from '../components/PhotoGrid';
import { db } from '../utils/db';

const CompilationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compilation, setCompilation] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const compilationData = await db.compilations.get(parseInt(id));
      if (!compilationData) {
        navigate('/compilations');
        return;
      }
      
      // Get all photos in this compilation
      const compilationPhotos = await Promise.all(
        (compilationData.photoIds || []).map(photoId => db.photos.get(photoId))
      );
      
      setCompilation(compilationData);
      setPhotos(compilationPhotos.filter(p => p !== undefined));
    } catch (error) {
      console.error('Error loading compilation data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [id, navigate]);
  
  const handleDeleteCompilation = async () => {
    if (!window.confirm(`Are you sure you want to delete the compilation "${compilation.name}"?`)) {
      return;
    }
    
    try {
      await db.compilations.delete(parseInt(id));
      navigate('/compilations');
    } catch (error) {
      console.error('Error deleting compilation:', error);
    }
  };
  
  if (!compilation && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Compilation not found.</p>
        <button
          onClick={() => navigate('/compilations')}
          className="mt-4 btn btn-primary"
        >
          Back to Compilations
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/compilations')}
            className="mr-3 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {loading ? 'Loading...' : compilation.name}
          </h1>
        </div>
        
        {compilation && (
          <button
            onClick={handleDeleteCompilation}
            className="btn flex items-center bg-red-500 hover:bg-red-600 text-white"
          >
            <FaTrash className="mr-1" />
            Delete Compilation
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          This is an AI-generated compilation of your memories. These photos are still available in your main gallery.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading compilation photos...</p>
        </div>
      ) : (
        <PhotoGrid photos={photos} />
      )}
    </div>
  );
};

export default CompilationView;
