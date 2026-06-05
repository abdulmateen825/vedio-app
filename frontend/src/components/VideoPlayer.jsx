const VideoPlayer = ({ video }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-100">
      <div className="aspect-video bg-slate-200">
        {video.videoUrl ? (
          <video
            controls
            poster={video.thumbnail}
            src={video.videoUrl}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
