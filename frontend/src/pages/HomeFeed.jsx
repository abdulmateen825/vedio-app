import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockVideos } from "../data/mockData.js";
import CategoryBar from "../components/CategoryBar.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { apiClient } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";

const mapVideo = (video) => ({
  id: video._id || video.id,
  title: video.title,
  channel: video.owner?.username || video.channel || "Unknown",
  views: typeof video.views === "number" ? video.views.toLocaleString() : video.views,
  createdAt: video.createdAt ? new Date(video.createdAt).toLocaleDateString() : video.createdAt,
  duration: video.duration ? `${Math.floor(video.duration / 60)}:${
    `${video.duration % 60}`.padStart(2, "0")
  }` : video.duration,
  thumbnail: video.thumbnailUrl || video.thumbnail,
  avatar: video.owner?.avatar || video.avatar
});

const HomeFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/videos", {
          params: { page: 1, limit: 12 }
        });
        const items = response.data?.data?.items || [];
        if (active) {
          setVideos(items.map(mapVideo));
          setError("");
        }
      } catch (err) {
        if (active) {
          setVideos(mockVideos);
          setError("Showing cached recommendations");
          showToast("Unable to reach backend. Showing mock data.", "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVideos();
    return () => {
      active = false;
    };
  }, [showToast]);

  const renderedVideos = useMemo(() => videos, [videos]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Recommended for you</h2>
        <p className="mt-2 text-sm text-slate-500">
          Fresh perspectives from creators you follow.
        </p>
      </div>

      <CategoryBar />

      {error && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-60 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        {!loading &&
          renderedVideos.map((video) => (
            <Link key={video.id} to={`/watch/${video.id}`}>
              <VideoCard video={video} />
            </Link>
          ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Infinite scrolling placeholder. Load more videos here.
      </div>
    </div>
  );
};

export default HomeFeed;
