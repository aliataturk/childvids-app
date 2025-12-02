import { NextRequest, NextResponse } from 'next/server';
import { YouTubeSearchResponse, Video } from '@/types';
import { categories, getAgeSearchModifier } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'music';
  const ageGroup = searchParams.get('ageGroup') || '';
  const pageToken = searchParams.get('pageToken') || '';
  const maxResults = searchParams.get('maxResults') || '12';

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  try {
    const categoryData = categories.find(c => c.id === category);
    if (!categoryData) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    let searchQuery = categoryData.searchTerm;
    if (ageGroup) {
      const ageModifier = getAgeSearchModifier(ageGroup);
      searchQuery = `${searchQuery} ${ageModifier}`;
    }

    const params = new URLSearchParams({
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      safeSearch: 'strict',
      videoEmbeddable: 'true',
      maxResults: maxResults,
      key: apiKey,
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || 'YouTube API error' },
        { status: response.status }
      );
    }

    const data: YouTubeSearchResponse = await response.json();

    const videos: Video[] = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json({
      videos,
      nextPageToken: data.nextPageToken,
      prevPageToken: data.prevPageToken,
      totalResults: data.pageInfo.totalResults,
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
