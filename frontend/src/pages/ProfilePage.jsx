import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { apiClient, getApiErrorMessage, mapVideo, unwrapApiData } from "../utils/api.js";

const ProfilePage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const username = id === "me" ? user?.username : id;
        if (!username) return;

        const profileRes = await apiClient.get(`/users/c/${username}`);
        const channelData = unwrapApiData(profileRes);
        const videosRes = await apiClient.get("/videos", {
          params: { owner: channelData._id, page: 1, limit: 12 }
        });

        if (active) {
          setChannel(channelData);
          setVideos((videosRes.data?.data?.items || []).map(mapVideo));
          setError("");
        }
      } catch (err) {
        if (active) {
          const message = getApiErrorMessage(err, "Unable to load profile.");
          setError(message);
          setChannel(null);
          setVideos([]);
          showToast(message, "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [id, user?.username, showToast]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      showToast("Sign in to subscribe.", "error");
      return;
    }

    try {
      setSubscribing(true);
      const response = await apiClient.post("/subscriptions/toggle", {
        channelId: channel._id
      });
      const subscribed = response.data?.data?.subscribed;
      setChannel((current) => ({
        ...current,
        isSubscribed: subscribed,
        subscribersCount: Math.max(
          0,
          (current?.subscribersCount || 0) + (subscribed ? 1 : -1)
        )
      }));
    } catch (err) {
      showToast(getApiErrorMessage(err, "Unable to update subscription."), "error");
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (error || !channel) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {error || "Profile not found."}
      </div>
    );
  }

  const isOwnProfile = user?._id === channel?._id;

  return (
    <div className="space-y-6">
      <ProfileHeader
        channel={channel}
        onSubscribe={handleSubscribe}
        subscribing={subscribing}
        isOwnProfile={isOwnProfile}
      />

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-500">
          <button className="rounded-full bg-brand/10 px-4 py-2 text-brand">
            Videos
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <Link key={video.id} to={`/watch/${video.id}`}>
            <VideoCard video={video} />
          </Link>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-sm text-slate-500">
          This channel has no published videos yet.
        </div>
      )}

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">About</h3>
        <p className="mt-2 text-sm text-slate-500">
          {channel.fullname || channel.username} has{" "}
          {(channel.subscribersCount || 0).toLocaleString()} subscribers and{" "}
          {(channel.subscriptionsCount || 0).toLocaleString()} subscriptions.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
