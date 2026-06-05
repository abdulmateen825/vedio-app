import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm.jsx";
import { apiClient } from "../utils/api.js";
import { useToast } from "../context/ToastContext.jsx";

const UploadPage = () => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    category: "",
    duration: ""
  });
  const [files, setFiles] = useState({ videoFile: null, thumbnail: null });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files: selected } = event.target;
    setFiles((prev) => ({ ...prev, [name]: selected?.[0] || null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files.videoFile || !files.thumbnail || !values.title || !values.duration) {
      showToast("Video, thumbnail, title, and duration are required.", "error");
      return;
    }

    const payload = new FormData();
    payload.append("videoFile", files.videoFile);
    payload.append("thumbnail", files.thumbnail);
    payload.append("title", values.title);
    payload.append("description", values.description);
    payload.append("category", values.category);
    payload.append("duration", values.duration);

    try {
      setLoading(true);
      setProgress(0);
      const response = await apiClient.post("/videos", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        }
      });
      showToast("Video uploaded successfully");
      const id = response.data?.data?._id;
      if (id) {
        navigate(`/watch/${id}`);
      } else {
        navigate("/home");
      }
    } catch (error) {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">Upload a new video</h2>
        <p className="mt-2 text-sm text-slate-500">
          Share your latest content with your audience in minutes.
        </p>
      </div>
      <UploadForm
        values={values}
        progress={progress}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default UploadPage;
