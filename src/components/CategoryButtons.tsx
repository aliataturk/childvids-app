'use client';

import { Category } from '@/types';

interface CategoryButtonsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  translations?: Record<string, string>;
}

export default function CategoryButtons({
  categories,
  selectedCategory,
  onCategoryChange,
  translations = {},
}: CategoryButtonsProps) {
  const getTranslatedName = (name: string) => translations[name] || name;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-purple-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-purple-100 hover:text-purple-700 shadow-md'
          }`}
        >
          {getTranslatedName(category.name)}
        </button>
      ))}
    </div>
  );
}
