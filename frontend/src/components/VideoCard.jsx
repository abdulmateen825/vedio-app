import { memo } from "react";
import { motion } from "framer-motion";

const VideoCard = memo(({ video }) => {
  const thumbnail =
    video.thumbnail ||
    `https://placehold.co/640x360/e2e8f0/475569?text=${encodeURIComponent(video.title || "Video")}`;
  const avatar =
    video.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channel || "Vedio")}&background=C2410C&color=fff`;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition"
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={video.title}
          className="h-44 w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
          {video.duration}
        </span>
      </div>
      <div className="flex gap-3 p-4">
        <img
          src={avatar}
          alt={video.channel}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0 space-y-1">
          <p className="line-clamp-2 text-sm font-semibold text-ink">
            {video.title}
          </p>
          <p className="truncate text-xs text-slate-500">{video.channel}</p>
          <p className="text-xs text-slate-400">
            {video.views} views - {video.createdAt}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default VideoCard;
