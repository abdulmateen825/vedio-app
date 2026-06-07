import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { apiClient, formatCount, mapVideo } from "../utils/api.js";

const features = [
  {
    title: "Cinematic playback",
    description: "Adaptive streaming with intelligent bandwidth tuning."
  },
  {
    title: "Creator dashboards",
    description: "Track performance and audience insights at a glance."
  },
  {
    title: "Curated discovery",
    description: "Signal-boosted recommendations designed for focus."
  }
];

const LandingPage = () => {
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;

    const loadVideos = async () => {
      try {
        const response = await apiClient.get("/videos", {
          params: { page: 1, limit: 6 }
        });
        const data = response.data?.data || {};
        if (active) {
          setVideos((data.items || []).map(mapVideo));
          setTotal(data.total || 0);
        }
      } catch (error) {
        if (active) {
          setVideos([]);
          setTotal(0);
        }
      }
    };

    loadVideos();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Published videos", value: formatCount(total) },
      {
        label: "Total views",
        value: formatCount(videos.reduce((sum, video) => sum + video.viewsCount, 0))
      },
      { label: "Latest uploads", value: formatCount(videos.length) },
      { label: "API status", value: videos.length || total ? "Live" : "Ready" }
    ],
    [total, videos]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-20 lg:flex-row lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Premium streaming platform
            </p>
            <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              Build your next audience with cinematic video experiences.
            </h1>
            <p className="mt-5 text-base text-slate-500">
              Vedio blends the clarity of YouTube with the polish of modern SaaS
              tools. Upload, monetize, and track every insight from one
              intelligent workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/home">
                <Button size="lg">Explore videos</Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="ghost" size="lg">
                  Start creating
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 shadow-soft">
              <div className="grid gap-4 md:grid-cols-2">
                {videos.slice(0, 4).map((video) => (
                  <Link key={video.id} to={`/watch/${video.id}`}>
                    <VideoCard video={video} />
                  </Link>
                ))}
                {videos.length === 0 && (
                  <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    Published videos from your backend will appear here.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-ink">Trending now</h2>
            <Link to="/home" className="text-sm text-brand">
              See all
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {videos.slice(0, 3).map((video) => (
              <Link key={video.id} to={`/watch/${video.id}`}>
                <VideoCard video={video} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 rounded-xl border border-slate-100 bg-white p-8 shadow-soft md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-semibold text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-xl bg-brand px-8 py-12 text-white shadow-lift">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">
                Ready to launch your channel?
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Set up your profile, upload your first video, and unlock
                advanced analytics in minutes.
              </p>
            </div>
            <Link to="/auth/register">
              <Button variant="ghost" className="bg-white text-brand">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <p>Vedio 2026. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
