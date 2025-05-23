import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import PhotoModal from './PhotoModal';

const PhotoGrid = ({ photos, onPhotoDelete }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="memory-card group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <img
                src={photo.url}
                alt={photo.fileName}
                className="w-full h-full object-cover"
              />
              {onPhotoDelete && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPhotoDelete(photo.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={onPhotoDelete}
        />
      )}
    </>
  );
};

export default PhotoGrid;