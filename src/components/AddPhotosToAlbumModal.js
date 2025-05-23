import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { getPhotos, db } from '../utils/db';
import PhotoUploader from './PhotoUploader';

const AddPhotosToAlbumModal = ({ album, onClose, onComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const allPhotos = await getPhotos();
      // Filter out photos that are already in the album
      const availablePhotos = allPhotos.filter(photo => photo.albumId !== album.id);
      setPhotos(availablePhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo) => {
    setSelectedPhotos(prev => 
      prev.includes(photo.id) 
        ? prev.filter(id => id !== photo.id)
        : [...prev, photo.id]
    );
  };

  const handleAddPhotos = async () => {
    try {
      // Update all selected photos with the album ID
      await Promise.all(
        selectedPhotos.map(photoId =>
          db.photos.update(photoId, { albumId: album.id })
        )
      );
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error adding photos to album:', error);
      alert('Failed to add photos to album. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Add Photos to {album.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 flex-grow overflow-auto">
          {showUploader ? (
            <div>
              <PhotoUploader 
                onUploadComplete={() => {
                  loadPhotos();
                  setShowUploader(false);
                }}
                albumId={album.id}
              />
              <button
                onClick={() => setShowUploader(false)}
                className="mt-4 btn btn-outline"
              >
                Back to Photo Selection
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setShowUploader(true)}
                  className="btn btn-primary flex items-center"
                >
                  <FaPlus className="mr-1" />
                  Upload New Photos
                </button>
                <button
                  onClick={handleAddPhotos}
                  disabled={selectedPhotos.length === 0}
                  className="btn btn-primary"
                >
                  Add Selected Photos ({selectedPhotos.length})
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading photos...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => handlePhotoSelect(photo)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square ${
                        selectedPhotos.includes(photo.id) ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.fileName}
                        className="w-full h-full object-cover"
                      />
                      {selectedPhotos.includes(photo.id) && (
                        <div className="absolute inset-0 bg-primary bg-opacity-30 flex items-center justify-center">
                          <div className="bg-primary text-white rounded-full p-2">
                            <FaPlus />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AddPhotosToAlbumModal;