import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaTrash } from 'react-icons/fa';

const PhotoModal = ({ photo, onClose, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      await onDelete(photo.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Delete photo"
            >
              <FaTrash />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            title="Close preview"
          >
            <FaTimes />
          </button>
        </div>

        <div className="relative aspect-auto max-h-[80vh] w-full">
          <img
            src={photo.url}
            alt={photo.fileName}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 bg-white border-t">
          <h3 className="font-medium text-gray-900">{photo.fileName}</h3>
          <p className="text-sm text-gray-500">
            Added {new Date(photo.date).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoModal;