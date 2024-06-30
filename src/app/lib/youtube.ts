import { google, youtube_v3 } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function findVideo(query: string): Promise<any> {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 1,
      order: 'relevance'
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      const videoId = video.id?.videoId;
      const videoTitle = video.snippet?.title;
      return videoId;

    } else {
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}