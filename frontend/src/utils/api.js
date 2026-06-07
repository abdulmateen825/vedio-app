import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true
});

export const getApiErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;

export const unwrapApiData = (response) => response?.data?.data;

export const formatCount = (value) => {
  const number = Number(value || 0);
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
  return number.toLocaleString();
};

export const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
};

export const formatDuration = (value) => {
  const seconds = Number(value || 0);
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};

export const mapVideo = (video = {}) => ({
  id: video._id || video.id,
  rawId: video._id || video.id,
  title: video.title || "Untitled video",
  description: video.description || "",
  channel: video.owner?.fullname || video.owner?.username || "Unknown creator",
  channelUsername: video.owner?.username || "",
  ownerId: video.owner?._id || video.owner || "",
  views: formatCount(video.views),
  viewsCount: Number(video.views || 0),
  createdAt: formatDate(video.createdAt),
  duration: formatDuration(video.duration),
  thumbnail: video.thumbnailUrl || video.thumbnail || "",
  avatar: video.owner?.avatar || video.avatar || "",
  videoUrl: video.videoUrl || "",
  category: video.category || ""
});
