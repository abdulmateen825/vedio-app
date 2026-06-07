import Button from "./Button.jsx";

const ProfileHeader = ({ channel, onSubscribe, subscribing, isOwnProfile }) => {
  const coverImage =
    channel?.coverImage ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";
  const avatar =
    channel?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(channel?.fullname || channel?.username || "Vedio")}&background=C2410C&color=fff`;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: channel?.fullname || channel?.username, url });
      return;
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-soft">
      <div
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url("${coverImage}")` }}
      />
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={channel?.fullname || channel?.username || "Channel"}
            className="h-20 w-20 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {channel?.fullname || channel?.username || "Channel"}
            </h2>
            <p className="text-sm text-slate-500">
              @{channel?.username} - {(channel?.subscribersCount || 0).toLocaleString()} subscribers
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {!isOwnProfile && (
            <Button onClick={onSubscribe} disabled={subscribing}>
              {subscribing
                ? "Updating..."
                : channel?.isSubscribed
                ? "Subscribed"
                : "Subscribe"}
            </Button>
          )}
          <Button variant="ghost" onClick={handleShare}>Share</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
