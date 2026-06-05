const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-brand" />
        <div className="h-2 w-2 animate-pulse rounded-full bg-brand/70" />
        <div className="h-2 w-2 animate-pulse rounded-full bg-brand/40" />
      </div>
    </div>
  );
};

export default Loader;
