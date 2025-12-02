'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  formattedDate: string;
  duration: string;
  viewCount: string;
  formattedViewCount: string;
  likeCount: string;
  tags: string[];
}

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/youtube/video?id=${videoId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch video');
        }

        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="aspect-video bg-gray-200 rounded-xl" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
        >
          ← Back to Videos
        </Link>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Videos
      </Link>

      {/* Video Player */}
      <div className="aspect-video rounded-xl overflow-hidden shadow-xl mb-6">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=0&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Video Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {video.title}
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">👁️</span>
            <span>{video.formattedViewCount} views</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👍</span>
            <span>{parseInt(video.likeCount).toLocaleString()} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            <span>{video.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span>{video.formattedDate}</span>
          </div>
        </div>

        {/* Channel */}
        <div className="border-t border-b border-gray-100 py-4 mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Channel:</span>{' '}
            {video.channelTitle}
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Description
          </h2>
          <p className="text-gray-600 whitespace-pre-line">{video.description}</p>
        </div>

        {/* Tags */}
        {video.tags.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {video.tags.slice(0, 10).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
