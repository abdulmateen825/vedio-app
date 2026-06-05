export const stats = [
  { label: "Active creators", value: "12.4k" },
  { label: "Videos streamed", value: "4.2M" },
  { label: "Avg. watch time", value: "18m" },
  { label: "Global users", value: "2.6M" }
];

export const mockVideos = Array.from({ length: 12 }).map((_, index) => ({
  id: `video-${index + 1}`,
  title: `Designing modern interfaces ${index + 1}`,
  channel: "Studio Nova",
  views: "128k",
  createdAt: "2 days ago",
  duration: "12:34",
  thumbnail:
    "https://images.unsplash.com/photo-1517495306984-93742f4f9f6a?auto=format&fit=crop&w=800&q=80",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
}));

export const trendingVideos = mockVideos.slice(0, 6);
