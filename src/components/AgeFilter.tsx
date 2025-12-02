'use client';

import { AgeGroup } from '@/types';

interface AgeFilterProps {
  ageGroups: AgeGroup[];
  selectedAgeGroup: string;
  onAgeGroupChange: (ageGroupId: string) => void;
  translations?: Record<string, string>;
}

export default function AgeFilter({
  ageGroups,
  selectedAgeGroup,
  onAgeGroupChange,
  translations = {},
}: AgeFilterProps) {
  const getTranslatedLabel = (label: string) => translations[label] || label;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => onAgeGroupChange('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selectedAgeGroup === ''
            ? 'bg-green-600 text-white shadow-lg scale-105'
            : 'bg-white text-gray-700 hover:bg-green-100 hover:text-green-700 shadow-md'
        }`}
      >
        All Ages
      </button>
      {ageGroups.map((ageGroup) => (
        <button
          key={ageGroup.id}
          onClick={() => onAgeGroupChange(ageGroup.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedAgeGroup === ageGroup.id
              ? 'bg-green-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-green-100 hover:text-green-700 shadow-md'
          }`}
        >
          {getTranslatedLabel(ageGroup.label)}
        </button>
      ))}
    </div>
  );
}
