import { useEffect, useState } from "react";
import { FiHeart, FiShare2, FiBookmark } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { mockVideos } from "../data/mockData.js";
import VideoPlayer from "../components/VideoPlayer.jsx";
import CommentCard from "../components/CommentCard.jsx";
import VideoCard from "../components/VideoCard.jsx";
import Button from "../components/Button.jsx";
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
  avatar: video.owner?.avatar || video.avatar,
  videoUrl: video.videoUrl
});

const VideoWatch = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [video, setVideo] = useState(mockVideos[0]);
  const [upNext, setUpNext] = useState(mockVideos.slice(1, 5));
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadVideo = async () => {
      try {
        setLoading(true);
        const [videoRes, listRes, commentsRes] = await Promise.all([
          apiClient.get(`/videos/${id}`),
          apiClient.get("/videos", { params: { page: 1, limit: 4 } }),
          apiClient.get(`/videos/${id}/comments`, { params: { page: 1, limit: 6 } })
        ]);

        const fetchedVideo = mapVideo(videoRes.data?.data || {});
        const listItems = listRes.data?.data?.items || [];
        const commentItems = commentsRes.data?.data?.items || [];

        if (active) {
          setVideo(fetchedVideo);
          setUpNext(listItems.map(mapVideo));
          setComments(
            commentItems.map((comment) => ({
              id: comment._id,
              user: comment.owner?.fullname || comment.owner?.username,
              time: new Date(comment.createdAt).toLocaleDateString(),
              text: comment.content,
              avatar: comment.owner?.avatar
            }))
          );
        }
      } catch (err) {
        if (active) {
          showToast("Unable to load video. Showing mock data.", "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadVideo();
    return () => {
      active = false;
    };
  }, [id, showToast]);

  return (
    <div className="grid gap-8 lg:grid-cols-[2.2fr_1fr]">
      <div className="space-y-6">
        <VideoPlayer video={video} />
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-ink">{video.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{video.views} views</span>
            <span>{video.createdAt}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="subtle">
              <FiHeart /> Like
            </Button>
            <Button variant="subtle">
              <FiShare2 /> Share
            </Button>
            <Button variant="subtle">
              <FiBookmark /> Save
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-ink">About this video</h3>
          <p className="mt-2 text-sm text-slate-500">
            A quick deep dive into modern design systems and how to build a
            future-ready video product experience.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">Comments</h3>
          <div className="space-y-3">
            {loading && (
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            )}
            {!loading && comments.length === 0 && (
              <p className="text-sm text-slate-500">No comments yet.</p>
            )}
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Up next</h3>
        <div className="space-y-4">
          {upNext.map((nextVideo) => (
            <Link key={nextVideo.id} to={`/watch/${nextVideo.id}`}>
              <VideoCard video={nextVideo} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;
