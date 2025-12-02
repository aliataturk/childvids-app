import { Category, AgeGroup } from '@/types';

export const categories: Category[] = [
  { id: 'music', name: 'Music', searchTerm: 'children music songs' },
  { id: 'art', name: 'Art', searchTerm: 'kids art crafts tutorial' },
  { id: 'dance', name: 'Dance', searchTerm: 'children dance tutorial' },
  { id: 'educational', name: 'Educational', searchTerm: 'kids educational learning' },
  { id: 'stories', name: 'Stories', searchTerm: 'children stories bedtime' },
  { id: 'animals', name: 'Animals', searchTerm: 'kids animals nature' },
  { id: 'science', name: 'Science', searchTerm: 'kids science experiments' },
  { id: 'cartoons', name: 'Cartoons', searchTerm: 'children cartoons animation' },
];

export const ageGroups: AgeGroup[] = [
  { id: 'toddler', label: '0-3 years', minAge: 0, maxAge: 3 },
  { id: 'preschool', label: '3-5 years', minAge: 3, maxAge: 5 },
  { id: 'early-school', label: '5-8 years', minAge: 5, maxAge: 8 },
  { id: 'school', label: '8-12 years', minAge: 8, maxAge: 12 },
];

export function getAgeSearchModifier(ageGroupId: string): string {
  const ageGroup = ageGroups.find(ag => ag.id === ageGroupId);
  if (!ageGroup) return '';
  
  switch (ageGroupId) {
    case 'toddler':
      return 'for babies toddlers';
    case 'preschool':
      return 'for preschool kindergarten';
    case 'early-school':
      return 'for kids ages 5 6 7 8';
    case 'school':
      return 'for kids ages 8 9 10 11 12';
    default:
      return '';
  }
}

export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
