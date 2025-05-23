import Dexie from 'dexie';

export const db = new Dexie('GoldenFramesDB');

db.version(1).stores({
  photos: '++id, fileName, tags, date, albumId',
  albums: '++id, name, createdAt',
  compilations: '++id, name, photoIds, createdAt'
});

// Helper functions for database operations
export const addPhoto = async (photoData) => {
  return await db.photos.add({
    ...photoData,
    date: new Date(),
    albumId: photoData.albumId || null
  });
};

export const getPhotos = async () => {
  return await db.photos.toArray();
};

export const getPhotosByAlbum = async (albumId) => {
  return await db.photos.where('albumId').equals(albumId).toArray();
};

export const createAlbum = async (name) => {
  return await db.albums.add({
    name,
    createdAt: new Date()
  });
};

export const getAlbums = async () => {
  return await db.albums.toArray();
};

export const addPhotosToAlbum = async (albumId, photoIds) => {
  return await Promise.all(
    photoIds.map(photoId =>
      db.photos.update(photoId, { albumId })
    )
  );
};

export const removePhotoFromAlbum = async (photoId) => {
  return await db.photos.update(photoId, { albumId: null });
};

export const createCompilation = async (name, photoIds) => {
  return await db.compilations.add({
    name,
    photoIds,
    createdAt: new Date()
  });
};

export const getCompilations = async () => {
  return await db.compilations.toArray();
};

export const getCompilationPhotos = async (compilationId) => {
  const compilation = await db.compilations.get(compilationId);
  if (!compilation) return [];
  
  const photos = await Promise.all(
    compilation.photoIds.map(id => db.photos.get(id))
  );
  
  return photos.filter(photo => photo !== undefined);
};