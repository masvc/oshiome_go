import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  supporterCount: number;
  deadline: string;
  is_favorite?: boolean;
  creator?: {
    name: string;
    avatarUrl: string;
  };
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Project[]>([]);

  useEffect(() => {
    // ローカルストレージからお気に入りを読み込む
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      console.log('ローカルストレージからお気に入りを読み込み:', JSON.parse(storedFavorites));
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (project: Project) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === project.id);
      const newFavorites = isFavorite
        ? prevFavorites.filter(fav => fav.id !== project.id)
        : [...prevFavorites, { ...project, is_favorite: true }];
      
      // ローカルストレージに保存
      console.log('お気に入りを保存:', newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (projectId: string) => {
    return favorites.some(fav => fav.id === projectId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
}; 