import { useEffect, useState } from "react";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer.jsx";
import CommentCard from "../components/CommentCard.jsx";
import VideoCard from "../components/VideoCard.jsx";
import Button from "../components/Button.jsx";
import {
  apiClient,
  getApiErrorMessage,
  mapVideo,
  unwrapApiData
} from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const VideoWatch = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [video, setVideo] = useState(null);
  const [upNext, setUpNext] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likes, setLikes] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    let active = true;

    const loadVideo = async () => {
      try {
        setLoading(true);
        const [videoRes, listRes, commentsRes, likesRes] = await Promise.all([
          apiClient.get(`/videos/${id}`),
          apiClient.get("/videos", { params: { page: 1, limit: 4 } }),
          apiClient.get(`/videos/${id}/comments`, { params: { page: 1, limit: 6 } }),
          apiClient.get("/likes/count", {
            params: { targetType: "Video", targetId: id }
          })
        ]);

        const fetchedVideo = mapVideo(unwrapApiData(videoRes) || {});
        const listItems = listRes.data?.data?.items || [];
        const commentItems = commentsRes.data?.data?.items || [];

        if (active) {
          setVideo(fetchedVideo);
          setUpNext(listItems.filter((item) => item._id !== id).map(mapVideo));
          setLikes(likesRes.data?.data?.count || 0);
          setComments(
            commentItems.map((comment) => ({
              id: comment._id,
              user: comment.owner?.fullname || comment.owner?.username,
              time: new Date(comment.createdAt).toLocaleDateString(),
              text: comment.content,
              avatar: comment.owner?.avatar
            }))
          );
          setError("");
        }
      } catch (err) {
        if (active) {
          const message = getApiErrorMessage(err, "Unable to load video.");
          setVideo(null);
          setUpNext([]);
          setComments([]);
          setError(message);
          showToast(message, "error");
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

  const handleLike = async () => {
    if (!isAuthenticated) {
      showToast("Sign in to like videos.", "error");
      return;
    }

    try {
      const response = await apiClient.post("/likes/toggle", {
        targetType: "Video",
        targetId: id
      });
      const liked = response.data?.data?.liked;
      setLikes((current) => Math.max(0, current + (liked ? 1 : -1)));
      showToast(liked ? "Video liked" : "Video unliked");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to update like."), "error");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Video link copied");
      }
    } catch (error) {
      showToast("Unable to share this video.", "error");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      showToast("Sign in to comment.", "error");
      return;
    }
    if (!commentText.trim()) return;

    try {
      setPostingComment(true);
      await apiClient.post(`/videos/${id}/comments`, { content: commentText });
      const response = await apiClient.get(`/videos/${id}/comments`, {
        params: { page: 1, limit: 6 }
      });
      const items = response.data?.data?.items || [];
      setComments(
        items.map((comment) => ({
          id: comment._id,
          user: comment.owner?.fullname || comment.owner?.username,
          time: new Date(comment.createdAt).toLocaleDateString(),
          text: comment.content,
          avatar: comment.owner?.avatar
        }))
      );
      setCommentText("");
      showToast("Comment posted");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to post comment."), "error");
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (error || !video) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {error || "Video not found."}
      </div>
    );
  }

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
            <Button variant="subtle" onClick={handleLike}>
              <FiHeart /> {likes.toLocaleString()} Likes
            </Button>
            <Button variant="subtle" onClick={handleShare}>
              <FiShare2 /> Share
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-ink">About this video</h3>
          <p className="mt-2 text-sm text-slate-500">
            {video.description || "No description provided."}
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink">Comments</h3>
          <form onSubmit={handleCommentSubmit} className="flex gap-3">
            <input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={isAuthenticated ? "Add a comment" : "Sign in to comment"}
              disabled={!isAuthenticated || postingComment}
              className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:bg-slate-50"
            />
            <Button disabled={!isAuthenticated || postingComment}>
              {postingComment ? "Posting..." : "Post"}
            </Button>
          </form>
          <div className="space-y-3">
            {comments.length === 0 && (
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
