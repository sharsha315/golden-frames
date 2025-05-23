import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaImages, FaMagic, FaPlus } from 'react-icons/fa';
import PhotoUploader from '../components/PhotoUploader';
import PhotoModal from '../components/PhotoModal';
import { getPhotos, getAlbums, getCompilations, getPhotosByAlbum, getCompilationPhotos } from '../utils/db';

const Home = () => {
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [compilations, setCompilations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const photos = await getPhotos();
      const albumsData = await getAlbums();
      const compilationsData = await getCompilations();
      
      // Sort photos by date (newest first)
      const sortedPhotos = photos.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Get photos for each album
      const albumsWithPhotos = await Promise.all(
        albumsData.map(async (album) => ({
          ...album,
          photos: await getPhotosByAlbum(album.id)
        }))
      );

      // Get photos for each compilation
      const compilationsWithPhotos = await Promise.all(
        compilationsData.map(async (compilation) => ({
          ...compilation,
          photos: await getCompilationPhotos(compilation.id)
        }))
      );
      
      setRecentPhotos(sortedPhotos.slice(0, 8));
      setAlbums(albumsWithPhotos);
      setCompilations(compilationsWithPhotos);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to GoldenFrames</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload, organize, and rediscover your photos with the help of AI. 
          Your memories stay on your device - we process everything locally for maximum privacy.
        </p>
      </div>
      
      <PhotoUploader onUploadComplete={loadData} />
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your memories...</p>
        </div>
      ) : (
        <>
          {/* Recent Photos Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Photos</h2>
              <Link to="/gallery" className="text-primary hover:underline flex items-center">
                View all <FaImages className="ml-1" />
              </Link>
            </div>
            
            {recentPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recentPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    className="memory-card cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={photo.url}
                        alt={photo.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FaImages className="mx-auto text-4xl text-gray-300 mb-2" />
                <p className="text-gray-500">No photos yet. Upload some to get started!</p>
              </div>
            )}
          </section>
          
          {/* AI Compilations Section */}
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">AI Memory Compilations</h2>
              <Link to="/compilations" className="text-primary hover:underline flex items-center">
                View all <FaMagic className="ml-1" />
              </Link>
            </div>
            
            {compilations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {compilations.slice(0, 4).map((compilation) => (
                  <Link key={compilation.id} to={`/compilation/${compilation.id}`}>
                    <motion.div 
                      className="memory-card h-full"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-purple-50">
                        {compilation.photos && compilation.photos[0] ? (
                          <div className="relative w-full h-full">
                            <img
                              src={compilation.photos[0].url}
                              alt={compilation.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-purple-500/10 flex items-center justify-center">
                              <FaMagic className="text-3xl text-white drop-shadow-lg" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaMagic className="text-5xl text-purple-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800">{compilation.name}</h3>
                        <div className="mt-1 text-xs text-gray-400">
                          Created {new Date(compilation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FaMagic className="mx-auto text-4xl text-gray-300 mb-2" />
                <p className="text-gray-500">
                  Upload more photos to generate AI memory compilations!
                </p>
              </div>
            )}
          </section>
          
          {/* Albums Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Albums</h2>
              <Link to="/gallery" className="text-primary hover:underline flex items-center">
                Manage albums <FaPlus className="ml-1" />
              </Link>
            </div>
            
            {albums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <Link key={album.id} to={`/album/${album.id}`}>
                    <motion.div 
                      className="memory-card h-full"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="relative aspect-square overflow-hidden bg-blue-50">
                        {album.photos && album.photos[0] ? (
                          <div className="relative w-full h-full">
                            <img
                              src={album.photos[0].url}
                              alt={album.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                              <FaImages className="text-3xl text-white drop-shadow-lg" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaImages className="text-5xl text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800">{album.name}</h3>
                        <div className="mt-1 text-xs text-gray-400">
                          Created {new Date(album.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FaImages className="mx-auto text-4xl text-gray-300 mb-2" />
                <p className="text-gray-500">No albums yet. Create one to organize your photos!</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPhoto(null);
          }}
          photo={selectedPhoto}
        />
      )}
    </div>
  );
};

export default Home;