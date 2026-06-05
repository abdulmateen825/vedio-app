import ProfileHeader from "../components/ProfileHeader.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { mockVideos } from "../data/mockData.js";

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-500">
          <button className="rounded-full bg-brand/10 px-4 py-2 text-brand">
            Videos
          </button>
          <button className="rounded-full bg-slate-100 px-4 py-2">About</button>
          <button className="rounded-full bg-slate-100 px-4 py-2">
            Playlists
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {mockVideos.slice(0, 6).map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink">About</h3>
        <p className="mt-2 text-sm text-slate-500">
          Product designer building premium creator tools with modern visuals
          and thoughtful storytelling.
        </p>
        <div className="mt-4 flex gap-4 text-sm text-brand">
          <span>alex.com</span>
          <span>twitter.com/alex</span>
          <span>dribbble.com/alex</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
