// AI service for photo compilations
export const generateCompilations = (photos) => {
  if (photos.length < 4) return [];
  
  const compilations = [];

  // Group photos by month and year
  const photosByMonth = photos.reduce((acc, photo) => {
    const date = new Date(photo.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[monthKey]) {
      acc[monthKey] = {
        photos: [],
        monthName: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear()
      };
    }
    acc[monthKey].photos.push(photo);
    return acc;
  }, {});

  // Create monthly compilations
  Object.values(photosByMonth)
    .filter(group => group.photos.length >= 3)
    .forEach(({ photos, monthName, year }) => {
      compilations.push({
        name: `${monthName} ${year} Memories`,
        photos: photos.slice(0, 8),
        type: 'monthly'
      });
    });

  // Create seasonal compilations
  const seasons = {
    'Spring': [2, 3, 4],
    'Summer': [5, 6, 7],
    'Autumn': [8, 9, 10],
    'Winter': [11, 0, 1]
  };

  Object.entries(seasons).forEach(([season, months]) => {
    const seasonalPhotos = photos.filter(photo => {
      const month = new Date(photo.date).getMonth();
      return months.includes(month);
    });

    if (seasonalPhotos.length >= 4) {
      compilations.push({
        name: `${season} Collection`,
        photos: seasonalPhotos.slice(0, 8),
        type: 'seasonal'
      });
    }
  });

  // Create time-based compilations
  const timeOfDay = {
    'Morning': [5, 6, 7, 8, 9, 10],
    'Afternoon': [11, 12, 13, 14, 15, 16],
    'Evening': [17, 18, 19, 20],
    'Night': [21, 22, 23, 0, 1, 2, 3, 4]
  };

  Object.entries(timeOfDay).forEach(([period, hours]) => {
    const periodPhotos = photos.filter(photo => {
      const hour = new Date(photo.date).getHours();
      return hours.includes(hour);
    });

    if (periodPhotos.length >= 4) {
      compilations.push({
        name: `${period} Moments`,
        photos: periodPhotos.slice(0, 8),
        type: 'timeOfDay'
      });
    }
  });

  // Add a random "mixed" compilation
  if (photos.length >= 6) {
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    compilations.push({
      name: 'Random Memories',
      photos: shuffled.slice(0, 6),
      type: 'random'
    });
  }

  // Add a "Latest Uploads" compilation
  const sortedByDate = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sortedByDate.length >= 4) {
    compilations.push({
      name: 'Recent Uploads',
      photos: sortedByDate.slice(0, 8),
      type: 'recent'
    });
  }

  return compilations;
};