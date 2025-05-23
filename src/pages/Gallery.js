import React, { useState, useEffect } from 'react';
import { FaPlus, FaFolder } from 'react-icons/fa';
import PhotoUploader from '../components/PhotoUploader';
import PhotoGrid from '../components/PhotoGrid';
import AlbumCard from '../components/AlbumCard';
import CreateAlbumModal from '../components/CreateAlbumModal';
import AddPhotosToAlbumModal from '../components/AddPhotosToAlbumModal';
import { getPhotos, getAlbums, getPhotosByAlbum, db } from '../utils/db';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumPhotoCounts, setAlbumPhotoCounts] = useState({});
  const [albumCoverPhotos, setAlbumCoverPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const photosData = await getPhotos();
      const albumsData = await getAlbums();
      
      // Sort photos by date (newest first)
      const sortedPhotos = photosData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Get photo counts and cover photos for each album
      const counts = {};
      const coverPhotos = {};
      
      for (const album of albumsData) {
        const albumPhotos = await getPhotosByAlbum(album.id);
        counts[album.id] = albumPhotos.length;
        
        if (albumPhotos.length > 0) {
          // Use the most recent photo as cover
          const sortedAlbumPhotos = albumPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));
          coverPhotos[album.id] = sortedAlbumPhotos[0];
        }
      }
      
      setPhotos(sortedPhotos);
      setAlbums(albumsData);
      setAlbumPhotoCounts(counts);
      setAlbumCoverPhotos(coverPhotos);
    } catch (error) {
      console.error('Error loading gallery data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handlePhotoDelete = async (photoId) => {
    try {
      await db.photos.delete(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      // Reload data to update album counts and cover photos
      loadData();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleAddPhotosToAlbum = (album) => {
    setSelectedAlbum(album);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Photo Gallery</h1>
        <button
          onClick={() => setShowCreateAlbumModal(true)}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-1" />
          Create Album
        </button>
      </div>
      
      <PhotoUploader onUploadComplete={loadData} />
      
      {/* Albums Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Albums</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                photoCount={albumPhotoCounts[album.id] || 0}
                coverPhoto={albumCoverPhotos[album.id]}
                onAddPhotos={handleAddPhotosToAlbum}
              />
            ))}
            
            {/* Create Album Card */}
            <div 
              onClick={() => setShowCreateAlbumModal(true)}
              className="memory-card h-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary"
            >
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <FaFolder className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">Create New Album</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* All Photos Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Photos</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your photos...</p>
          </div>
        ) : (
          <PhotoGrid photos={photos} onPhotoDelete={handlePhotoDelete} />
        )}
      </section>
      
      {showCreateAlbumModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateAlbumModal(false)}
          onAlbumCreated={loadData}
        />
      )}

      {selectedAlbum && (
        <AddPhotosToAlbumModal
          album={selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
          onComplete={loadData}
        />
      )}
    </div>
  );
};

export default Gallery;