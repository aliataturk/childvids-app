'use client';

import { useState, useEffect, useCallback } from 'react';
import { Video } from '@/types';
import { categories, ageGroups } from '@/lib/constants';
import CategoryButtons from '@/components/CategoryButtons';
import AgeFilter from '@/components/AgeFilter';
import VideoGrid from '@/components/VideoGrid';
import LoadMoreButton from '@/components/LoadMoreButton';

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('music');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const fetchTranslations = useCallback(async () => {
    try {
      // Detect browser language
      const browserLang = typeof navigator !== 'undefined' 
        ? navigator.language.split('-')[0] 
        : 'en';
      
      if (browserLang === 'en') return;

      const categoryNames = categories.map(c => c.name);
      const ageLabels = ageGroups.map(a => a.label);
      const allTexts = [...categoryNames, ...ageLabels];

      const response = await fetch(
        `/api/translate?texts=${encodeURIComponent(allTexts.join(','))}&lang=${browserLang}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTranslations(data.translations);
      }
    } catch (err) {
      console.error('Failed to fetch translations:', err);
    }
  }, []);

  const fetchVideos = useCallback(async (pageToken?: string) => {
    try {
      const isLoadingMore = !!pageToken;
      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setVideos([]);
      }
      setError(null);

      const params = new URLSearchParams({
        category: selectedCategory,
      });

      if (selectedAgeGroup) {
        params.append('ageGroup', selectedAgeGroup);
      }

      if (pageToken) {
        params.append('pageToken', pageToken);
      }

      const response = await fetch(`/api/youtube/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch videos');
      }

      if (isLoadingMore) {
        setVideos(prev => [...prev, ...data.videos]);
      } else {
        setVideos(data.videos);
      }
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, selectedAgeGroup]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setNextPageToken(null);
  };

  const handleAgeGroupChange = (ageGroupId: string) => {
    setSelectedAgeGroup(ageGroupId);
    setNextPageToken(null);
  };

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchVideos(nextPageToken);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <section className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
          📚 Choose a Category
        </h2>
        <CategoryButtons
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          translations={translations}
        />
      </section>

      {/* Age Filter */}
      <section className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
          👶 Select Age Group
        </h2>
        <AgeFilter
          ageGroups={ageGroups}
          selectedAgeGroup={selectedAgeGroup}
          onAgeGroupChange={handleAgeGroupChange}
          translations={translations}
        />
      </section>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
          <p>{error}</p>
          <button
            onClick={() => fetchVideos()}
            className="mt-2 text-red-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Video Grid */}
      <section>
        <VideoGrid videos={videos} loading={loading} />
        <LoadMoreButton
          loading={loadingMore}
          hasMore={!!nextPageToken}
          onClick={handleLoadMore}
        />
      </section>
    </div>
  );
}
