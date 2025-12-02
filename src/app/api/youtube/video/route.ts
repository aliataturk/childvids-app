import { NextRequest, NextResponse } from 'next/server';
import { YouTubeVideoResponse } from '@/types';
import { formatDuration, formatViewCount, formatDate } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('id');

  if (!videoId) {
    return NextResponse.json(
      { error: 'Video ID is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: apiKey,
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || 'YouTube API error' },
        { status: response.status }
      );
    }

    const data: YouTubeVideoResponse = await response.json();

    if (data.items.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    const video = data.items[0];
    const thumbnail = video.snippet.thumbnails.maxres?.url ||
      video.snippet.thumbnails.standard?.url ||
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default.url;

    return NextResponse.json({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      formattedDate: formatDate(video.snippet.publishedAt),
      duration: formatDuration(video.contentDetails.duration),
      viewCount: video.statistics.viewCount,
      formattedViewCount: formatViewCount(video.statistics.viewCount),
      likeCount: video.statistics.likeCount,
      tags: video.snippet.tags || [],
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video details' },
      { status: 500 }
    );
  }
}
