import { useRef, useState } from "react";
import api from "../services/api";
import Avatar from "./Avatar";
import { resolveImageUrl, prepareImageForUpload } from "../utils/images";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const RESIZE = { room: { maxSize: 1600 }, avatar: { maxSize: 400 } };

// kind is "room" or "avatar". onChange receives the new image path ('' when removed)
// and may be async. If it throws, the message is shown under the buttons.
function ImageUploader({ kind, value, onChange, label, name = "", hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isAvatar = kind === "avatar";
  const previewUrl = resolveImageUrl(value);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("That image is too large. Please choose one under 10 MB");
      return;
    }

    setBusy(true);
    try {
      const blob = await prepareImageForUpload(file, RESIZE[kind]);
      const formData = new FormData();
      formData.append("image", blob, "upload.jpg");
      const res = await api.post(`/images/${kind}`, formData);
      await onChange(res.data.path);
    } catch (err) {
      setError(
        err.userMessage || "Unable to upload this image. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    setBusy(true);
    try {
      await onChange("");
    } catch (err) {
      setError(err.userMessage || "Unable to remove this photo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div
        className={`d-flex gap-3 ${isAvatar ? "align-items-center" : "flex-column"}`}
      >
        {isAvatar ? (
          <Avatar name={name} src={value} size="xl" />
        ) : (
          <div className="image-uploader-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="" />
            ) : (
              <span className="text-small text-muted-custom">No photo yet</span>
            )}
          </div>
        )}

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="d-none"
            onChange={handleFile}
          />
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-outline-primary btn-sm ${busy ? "btn-loading" : ""}`}
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {value ? "Change photo" : "Upload photo"}
            </button>
            {value && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleRemove}
                disabled={busy}
              >
                Remove
              </button>
            )}
          </div>
          {hint && (
            <p className="text-small text-muted-custom mt-2 mb-0">{hint}</p>
          )}
          {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
