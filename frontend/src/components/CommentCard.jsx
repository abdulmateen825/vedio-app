const CommentCard = ({ comment }) => {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <img
        src={comment.avatar}
        alt={comment.user}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink">{comment.user}</p>
          <span className="text-xs text-slate-400">{comment.time}</span>
        </div>
        <p className="mt-2 text-sm text-slate-600">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentCard;
