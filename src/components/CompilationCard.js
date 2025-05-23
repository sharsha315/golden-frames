import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMagic, FaImage } from 'react-icons/fa';

const CompilationCard = ({ compilation, photos }) => {
  return (
    <Link to={`/compilation/${compilation.id}`}>
      <motion.div 
        className="memory-card h-full"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
              {photos.slice(0, 4).map((photo, index) => (
                <div key={index} className="overflow-hidden">
                  <img
                    src={photo.thumbnailUrl || photo.dataUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-50">
              <FaMagic className="text-5xl text-purple-300" />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-800">{compilation.name}</h3>
          <div className="mt-1 text-sm text-gray-500 flex items-center">
            <FaImage className="mr-1" />
            {photos ? photos.length : 0} {photos && photos.length === 1 ? 'photo' : 'photos'}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            Created {new Date(compilation.createdAt).toLocaleDateString()}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CompilationCard;
