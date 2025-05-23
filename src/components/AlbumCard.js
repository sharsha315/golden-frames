import React from 'react';
import { Link } from 'react-router-dom';
import { FaFolder, FaImage, FaPlus } from 'react-icons/fa';

const AlbumCard = ({ album, photoCount, coverPhoto, onAddPhotos }) => {
  const handleAddPhotosClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddPhotos(album);
  };

  return (
    <Link to={`/album/${album.id}`} className="memory-card group">
      <div className="aspect-square relative">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto.url}
              alt={album.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAddPhotosClick}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <FaPlus className="text-primary" />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <FaFolder className="mx-auto text-4xl text-gray-400 mb-2" />
              <button
                onClick={handleAddPhotosClick}
                className="btn btn-primary btn-sm flex items-center mx-auto"
              >
                <FaPlus className="mr-1" />
                Add Photos
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{album.name}</h3>
        <p className="text-sm text-gray-500 flex items-center">
          <FaImage className="mr-1" />
          {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
        </p>
      </div>
    </Link>
  );
};

export default AlbumCard;