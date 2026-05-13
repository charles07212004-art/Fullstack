export const extractYouTubeId = (url) => {
  if (!url) return null;

  const parseUrl = (input) => {
    try {
      return new URL(input);
    } catch {
      return null;
    }
  };

  const parsed = parseUrl(url);
  if (parsed) {
    const hostname = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    if (hostname.includes('youtu.be')) {
      return path.slice(1).split(/[?&]/)[0] || null;
    }

    if (hostname.includes('youtube.com') || hostname.includes('youtube-nocookie.com')) {
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }

      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.includes('embed')) {
        return pathSegments[pathSegments.indexOf('embed') + 1] || null;
      }
      if (pathSegments.includes('shorts')) {
        return pathSegments[pathSegments.indexOf('shorts') + 1] || null;
      }
      if (pathSegments.includes('v')) {
        return pathSegments[pathSegments.indexOf('v') + 1] || null;
      }
    }
  }

  const fallbackRegex = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/i;
  const fallbackMatch = url.match(fallbackRegex);
  return fallbackMatch ? fallbackMatch[1] : null;
};

export const getYouTubeEmbedUrl = (videoId) => {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

export const isYouTubeUrl = (url) => {
  return Boolean(extractYouTubeId(url));
};
