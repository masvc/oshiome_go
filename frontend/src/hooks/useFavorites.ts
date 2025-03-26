import { useState, useEffect } from 'react';
import { Project as AppProject } from '../types/project';

interface FavoriteProject {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  targetAmount: number;
  currentAmount: number;
  supporters_count: number;
  deadline: string;
  is_favorite?: boolean;
  creator?: {
    name: string;
    avatarUrl: string;
  };
  office_approved: boolean;
}

// AppProjectからFavoriteProjectへの変換関数
const convertToFavoriteProject = (project: AppProject): FavoriteProject => {
  return {
    id: project.id.toString(),
    title: project.title,
    description: project.description,
    thumbnail_url: project.thumbnail_url || '',
    targetAmount: project.target_amount,
    currentAmount: project.current_amount,
    supporters_count: project.supporters_count,
    deadline: project.deadline,
    is_favorite: true,
    creator: project.user ? {
      name: project.user.name,
      avatarUrl: project.user.profile_image_url || ''
    } : undefined,
    office_approved: project.office_approved
  };
};

// FavoriteProjectとして扱えるかチェックする型ガード関数
const isFavoriteProject = (project: any): project is FavoriteProject => {
  return (
    typeof project === 'object' &&
    'id' in project &&
    'title' in project &&
    'description' in project
  );
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);

  useEffect(() => {
    // ローカルストレージからお気に入りを読み込む
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        // 古い形式のデータを新しい形式に変換
        const converted = parsed.map((fav: any) => ({
          id: fav.id,
          title: fav.title,
          description: fav.description,
          thumbnail_url: fav.thumbnail_url || fav.imageUrl || '',
          targetAmount: fav.target_amount || fav.targetAmount,
          currentAmount: fav.current_amount || fav.currentAmount,
          supporters_count: fav.supporters_count || fav.supporterCount,
          deadline: fav.deadline,
          is_favorite: true,
          creator: fav.creator,
          office_approved: fav.office_approved ?? true
        }));
        setFavorites(converted);
      } catch (error) {
        console.error('お気に入りの読み込みに失敗しました:', error);
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (project: AppProject | FavoriteProject) => {
    setFavorites(prevFavorites => {
      const projectId = typeof project.id === 'number' ? project.id.toString() : project.id;
      const isFavorite = prevFavorites.some(fav => fav.id === projectId);
      
      if (isFavorite) {
        const newFavorites = prevFavorites.filter(fav => fav.id !== projectId);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      } else {
        const favoriteProject = 'target_amount' in project 
          ? convertToFavoriteProject(project as AppProject)
          : {
              id: project.id,
              title: project.title,
              description: project.description,
              thumbnail_url: project.thumbnail_url,
              targetAmount: (project as any).targetAmount,
              currentAmount: (project as any).currentAmount,
              supporters_count: project.supporters_count,
              deadline: project.deadline,
              is_favorite: true,
              creator: project.creator,
              office_approved: project.office_approved
            };
        const newFavorites = [...prevFavorites, favoriteProject];
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      }
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