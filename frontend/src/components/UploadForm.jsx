import { FiUploadCloud } from "react-icons/fi";
import Button from "./Button.jsx";
import Input from "./Input.jsx";

const UploadForm = ({
  values,
  progress,
  onChange,
  onFileChange,
  onSubmit,
  loading
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="space-y-4">
        <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <FiUploadCloud className="mx-auto text-3xl text-brand" />
          <p className="mt-4 text-sm font-medium text-ink">
            Drag & drop your video here
          </p>
          <p className="mt-2 text-xs text-slate-500">
            MP4, MOV, or AVI up to 1GB
          </p>
          <div className="mt-6">
            <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink">
              Browse files
            </span>
          </div>
          <input
            type="file"
            accept="video/*"
            name="videoFile"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-500">
            Upload Progress
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-brand"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Input
          label="Video title"
          name="title"
          value={values.title}
          onChange={onChange}
          placeholder="Give your video a name"
        />
        <Input
          label="Description"
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="Short description"
        />
        <Input
          label="Category"
          name="category"
          value={values.category}
          onChange={onChange}
          placeholder="Design, Tech, Music"
        />
        <Input
          label="Duration (seconds)"
          name="duration"
          type="number"
          value={values.duration}
          onChange={onChange}
          placeholder="120"
        />
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-600">
          Thumbnail
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={onFileChange}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-ink shadow-sm"
          />
        </label>
        <Button className="w-full" disabled={loading}>
          {loading ? "Publishing..." : "Publish video"}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;
