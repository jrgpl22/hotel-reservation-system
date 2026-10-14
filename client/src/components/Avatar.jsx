import { useState } from "react";
import { resolveImageUrl } from "../utils/images";

const SIZE_CLASS = { md: "", lg: "user-avatar-lg", xl: "avatar-xl" };

function Avatar({ name = "", src = "", size = "md", className = "" }) {
  const url = resolveImageUrl(src);
  const [failedUrl, setFailedUrl] = useState("");
  const showImage = url && failedUrl !== url; // fall back to the initial if the image can't load

  return (
    <span
      className={`user-chip-avatar ${SIZE_CLASS[size]} ${className}`.trim()}
    >
      {showImage ? (
        <img src={url} alt="" onError={() => setFailedUrl(url)} />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </span>
  );
}

export default Avatar;
