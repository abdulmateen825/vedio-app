import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryBar from "../components/CategoryBar.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { apiClient, getApiErrorMessage, mapVideo } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useUI } from "../context/UIContext.jsx";

const HomeFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const { activeCategory } = useUI();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/videos", {
          params: {
            page: 1,
            limit: 12,
            ...(search ? { search } : {}),
            ...(activeCategory !== "All" ? { category: activeCategory } : {})
          }
        });
        const data = response.data?.data || {};
        const items = data.items || [];
        if (active) {
          setVideos(items.map(mapVideo));
          setTotal(data.total || 0);
          setError("");
        }
      } catch (err) {
        if (active) {
          setVideos([]);
          setTotal(0);
          const message = getApiErrorMessage(err, "Unable to load videos.");
          setError(message);
          showToast(message, "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVideos();
    return () => {
      active = false;
    };
  }, [activeCategory, search, showToast]);

  const renderedVideos = useMemo(() => videos, [videos]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">Featured on CineNest</h2>
        <p className="mt-2 text-sm text-slate-500">
          {search
            ? `Search results for "${search}".`
            : total
            ? `${total.toLocaleString()} published videos from creators and studios.`
            : "Portfolio-ready videos will appear here after seeding your database."}
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

      {!loading && renderedVideos.length === 0 && !error && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No videos found for this category.
        </div>
      )}
    </div>
  );
};

export default HomeFeed;
