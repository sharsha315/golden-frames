import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import PhotoGrid from '../components/PhotoGrid';
import PhotoUploader from '../components/PhotoUploader';
import { db, getPhotosByAlbum } from '../utils/db';

const AlbumView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const albumData = await db.albums.get(parseInt(id));
      if (!albumData) {
        navigate('/gallery');
        return;
      }
      
      const albumPhotos = await getPhotosByAlbum(parseInt(id));
      // Sort photos by date (newest first)
      const sortedPhotos = albumPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setAlbum(albumData);
      setPhotos(sortedPhotos);
    } catch (error) {
      console.error('Error loading album data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [id, navigate]);
  
  const handlePhotoDelete = async (photoId) => {
    try {
      // Just remove the albumId from the photo, don't delete the photo
      const photo = await db.photos.get(photoId);
      if (photo) {
        await db.photos.update(photoId, { albumId: null });
        setPhotos(photos.filter(p => p.id !== photoId));
      }
    } catch (error) {
      console.error('Error removing photo from album:', error);
    }
  };
  
  const handleDeleteAlbum = async () => {
    if (!window.confirm(`Are you sure you want to delete the album "${album.name}"?`)) {
      return;
    }
    
    try {
      // Remove album ID from all photos in this album
      const albumPhotos = await getPhotosByAlbum(parseInt(id));
      await Promise.all(
        albumPhotos.map(photo => db.photos.update(photo.id, { albumId: null }))
      );
      
      // Delete the album
      await db.albums.delete(parseInt(id));
      
      navigate('/gallery');
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };
  
  const handlePhotoUpload = async () => {
    // After upload, reload the data to show new photos
    await loadData();
  };
  
  if (!album && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Album not found.</p>
        <button
          onClick={() => navigate('/gallery')}
          className="mt-4 btn btn-primary"
        >
          Back to Gallery
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/gallery')}
            className="mr-3 p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {loading ? 'Loading...' : album.name}
          </h1>
        </div>
        
        {album && (
          <button
            onClick={handleDeleteAlbum}
            className="btn flex items-center bg-red-500 hover:bg-red-600 text-white"
          >
            <FaTrash className="mr-1" />
            Delete Album
          </button>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Add photos to this album. They'll still appear in your main gallery too.
        </p>
      </div>
      
      <PhotoUploader onUploadComplete={handlePhotoUpload} />
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading album photos...</p>
        </div>
      ) : (
        <PhotoGrid photos={photos} onPhotoDelete={handlePhotoDelete} />
      )}
    </div>
  );
};

export default AlbumView;
