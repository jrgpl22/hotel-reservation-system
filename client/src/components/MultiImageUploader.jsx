import { useRef, useState } from "react";
import api from "../services/api";
import { resolveImageUrl, prepareImageForUpload } from "../utils/images";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

// images is an array of image paths. onChange receives the full new array.
function MultiImageUploader({ label, images, onChange, max = 6 }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // { done, total } while uploading
  const [error, setError] = useState("");
  const busy = progress !== null;
  const remaining = max - images.length;

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = ""; // lets the same files be picked again later
    if (files.length === 0) return;

    const problems = [];
    const usable = [];
    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type))
        problems.push(`${file.name} is not a JPG, PNG, or WebP image`);
      else if (file.size > MAX_SOURCE_BYTES)
        problems.push(`${file.name} is larger than 10 MB`);
      else usable.push(file);
    });

    const accepted = usable.slice(0, remaining);
    if (usable.length > accepted.length) {
      problems.push(
        `Only ${max} photos are allowed, so ${usable.length - accepted.length} could not be added`,
      );
    }
    if (accepted.length === 0) {
      setError(problems.join(". "));
      return;
    }

    setError("");
    setProgress({ done: 0, total: accepted.length });
    const uploaded = [];

    // One at a time keeps each request small and the progress easy to show
    for (const file of accepted) {
      try {
        const blob = await prepareImageForUpload(file, { maxSize: 1600 });
        const formData = new FormData();
        formData.append("image", blob, "upload.jpg");
        const res = await api.post("/images/room", formData);
        uploaded.push(res.data.path);
      } catch (err) {
        problems.push(`${file.name}: ${err.userMessage || "upload failed"}`);
      }
      setProgress(
        (current) => current && { ...current, done: current.done + 1 },
      );
    }

    if (uploaded.length > 0) onChange([...images, ...uploaded]);
    setProgress(null);
    setError(problems.join(". "));
  };

  const makeCover = (index) =>
    onChange([images[index], ...images.filter((_, i) => i !== index)]);
  const removeAt = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div>
      {label && <label className="form-label">{label}</label>}

      <div className="photo-grid">
        {images.map((path, index) => (
          <div className="photo-tile" key={`${index}-${path}`}>
            <img src={resolveImageUrl(path, { width: 400 })} alt="" />
            {index === 0 && <span className="photo-cover-badge">Cover</span>}
            <div className="photo-tile-actions">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  disabled={busy}
                >
                  Make cover
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={busy}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            className="photo-add"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <span className="photo-add-plus">+</span>
            <span>Add photos</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="d-none"
        onChange={handleFiles}
      />

      <p className="text-small text-muted-custom mt-2 mb-0">
        {busy
          ? `Uploading ${Math.min(progress.done + 1, progress.total)} of ${progress.total}...`
          : `${images.length} of ${max} photos. The first photo is the cover. Large photos are resized automatically.`}
      </p>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default MultiImageUploader;
