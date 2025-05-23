import React, { useState, useRef } from 'react';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import { addPhoto } from '../utils/db';

const PhotoUploader = ({ onUploadComplete, albumId = null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              await addPhoto({
                fileName: file.name,
                url: e.target.result,
                albumId: albumId,
                tags: []
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload one or more photos. Please try again.');
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = [...e.dataTransfer.files];
    await processFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = [...e.target.files];
    await processFiles(files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-colors
        ${isDragging ? 'border-primary bg-primary bg-opacity-10' : 'border-gray-300 hover:border-primary'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept="image/*"
      />

      {uploading ? (
        <div className="flex items-center justify-center space-x-2">
          <FaSpinner className="animate-spin text-primary" />
          <span className="text-gray-600">Uploading photos...</span>
        </div>
      ) : (
        <div>
          <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
          <p className="text-gray-600 mb-2">
            Drag and drop your photos here, or{' '}
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-primary hover:underline"
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: JPG, PNG, GIF
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;