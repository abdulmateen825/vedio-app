import { memo } from "react";
import { motion } from "framer-motion";

const VideoCard = memo(({ video }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition"
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-44 w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs text-white">
          {video.duration}
        </span>
      </div>
      <div className="flex gap-3 p-4">
        <img
          src={video.avatar}
          alt={video.channel}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink">
            {video.title}
          </p>
          <p className="text-xs text-slate-500">{video.channel}</p>
          <p className="text-xs text-slate-400">
            {video.views} views - {video.createdAt}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default VideoCard;
