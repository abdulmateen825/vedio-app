import Button from "./Button.jsx";

const ProfileHeader = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
      <div className="h-40 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
      <div className="flex flex-col gap-4 px-6 pb-6 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
            alt="profile"
            className="h-20 w-20 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-ink">Alex Romero</h2>
            <p className="text-sm text-slate-500">1.2M subscribers</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button>Subscribe</Button>
          <Button variant="ghost">Share</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
