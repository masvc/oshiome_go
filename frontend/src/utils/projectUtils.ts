import { Project } from '../types/project';
import { ProjectCardProps } from '../components/features/ProjectCard';

export const formatProjectForCard = (project: Project): ProjectCardProps => {
  return {
    id: project.id.toString(),
    title: project.title,
    description: project.description || '',
    targetAmount: project.target_amount,
    currentAmount: project.current_amount || 0,
    deadline: project.deadline,
    thumbnail_url: project.thumbnail_url || 'https://placehold.co/400x200',
    supporters_count: project.supporters_count,
    creator: project.user ? {
      name: project.user.name,
      avatarUrl: project.user.profile_image_url || 'https://placehold.co/100x100'
    } : undefined,
    office_approved: project.office_approved
  };
}; 