import React, { useState, useEffect } from 'react';
import { FaMagic, FaSun, FaMoon, FaCalendar, FaRandom } from 'react-icons/fa';
import PhotoGrid from '../components/PhotoGrid';
import { getPhotos, getCompilations, createCompilation, db } from '../utils/db';
import { generateCompilations } from '../utils/aiService';

const CompilationTypeIcons = {
  monthly: FaCalendar,
  seasonal: FaSun,
  timeOfDay: FaMoon,
  random: FaRandom,
  recent: FaMagic
};

const Compilations = () => {
  const [compilations, setCompilations] = useState([]);
  const [compilationPhotos, setCompilationPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const compilationsData = await getCompilations();
      
      // Get photos for each compilation
      const photosMap = {};
      for (const compilation of compilationsData) {
        const photos = await Promise.all(
          (compilation.photoIds || []).map(id => db.photos.get(id))
        );
        photosMap[compilation.id] = photos.filter(p => p !== undefined);
      }
      
      setCompilations(compilationsData);
      setCompilationPhotos(photosMap);
    } catch (error) {
      console.error('Error loading compilations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleGenerateCompilations = async () => {
    setGenerating(true);
    try {
      const photos = await getPhotos();
      
      if (photos.length < 5) {
        alert('You need at least 5 photos to generate compilations. Please upload more photos.');
        return;
      }
      
      // Clear existing compilations
      await db.compilations.clear();
      
      const aiCompilations = generateCompilations(photos);
      
      // Save the generated compilations to the database
      for (const comp of aiCompilations) {
        await createCompilation(
          comp.name,
          comp.photos.map(p => p.id),
          comp.type
        );
      }
      
      // Reload the data to show the new compilations
      await loadData();
    } catch (error) {
      console.error('Error generating compilations:', error);
      alert('Failed to generate compilations. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await db.photos.delete(photoId);
      // Update compilations that contain this photo
      const updatedCompilations = compilations.map(comp => ({
        ...comp,
        photoIds: (comp.photoIds || []).filter(id => id !== photoId)
      }));
      
      for (const comp of updatedCompilations) {
        if (comp.photoIds.length > 0) {
          await db.compilations.update(comp.id, { photoIds: comp.photoIds });
        } else {
          // Delete compilation if it has no photos
          await db.compilations.delete(comp.id);
        }
      }
      
      await loadData();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const renderCompilationIcon = (type) => {
    const Icon = CompilationTypeIcons[type] || FaMagic;
    return <Icon className="text-primary mr-2" />;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Memory Compilations</h1>
        <button
          onClick={handleGenerateCompilations}
          className="btn btn-primary flex items-center"
          disabled={generating}
        >
          <FaMagic className="mr-1" />
          {generating ? 'Generating...' : 'Generate New Memories'}
        </button>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Let AI find patterns in your photos and create meaningful compilations of your memories.
          All processing happens locally on your device for privacy.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your memory compilations...</p>
        </div>
      ) : (
        <>
          {compilations.length > 0 ? (
            <div className="space-y-8">
              {compilations.map((compilation) => (
                <div key={compilation.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    {renderCompilationIcon(compilation.type)}
                    <h2 className="text-xl font-semibold text-gray-800">{compilation.name}</h2>
                  </div>
                  {compilationPhotos[compilation.id]?.length > 0 ? (
                    <PhotoGrid
                      photos={compilationPhotos[compilation.id]}
                      onPhotoDelete={handleDeletePhoto}
                    />
                  ) : (
                    <p className="text-gray-500 text-center py-4">No photos in this compilation</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaMagic className="mx-auto text-5xl text-gray-300 mb-3" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Memory Compilations Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Upload more photos and let our AI create beautiful compilations of your memories.
              </p>
              <button
                onClick={handleGenerateCompilations}
                className="btn btn-primary flex items-center mx-auto"
                disabled={generating}
              >
                <FaMagic className="mr-1" />
                Generate Memories
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Compilations;