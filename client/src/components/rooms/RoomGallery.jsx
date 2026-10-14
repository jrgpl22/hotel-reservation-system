import { useState } from "react";
import Icon from "../Icon";
import {
  getRoomImages,
  resolveImageUrl,
  FALLBACK_ROOM_IMAGE,
} from "../../utils/images";

function RoomGallery({ room }) {
  const paths = getRoomImages(room);
  const photos = paths.length > 0 ? paths : [null];
  const large = photos.map((path) =>
    path ? resolveImageUrl(path, { width: 1200 }) : FALLBACK_ROOM_IMAGE,
  );
  const small = photos.map((path) =>
    path ? resolveImageUrl(path, { width: 200 }) : FALLBACK_ROOM_IMAGE,
  );

  const [active, setActive] = useState(0);
  const current = Math.min(active, large.length - 1);
  const go = (step) =>
    setActive((current + step + large.length) % large.length);

  return (
    <div className="mb-4">
      <div className="gallery-main">
        <img
          key={large[current]}
          src={large[current]}
          alt={`${room.roomType} photo ${current + 1}`}
          className="gallery-main-img"
        />

        {large.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-nav prev"
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              <Icon name="chevron" />
            </button>
            <button
              type="button"
              className="gallery-nav next"
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              <Icon name="chevron" />
            </button>
            <span className="gallery-count">
              {current + 1} / {large.length}
            </span>
          </>
        )}
      </div>

      {large.length > 1 && (
        <div className="gallery-thumbs">
          {small.map((url, index) => (
            <button
              key={`${index}-${url}`}
              type="button"
              className={`gallery-thumb${index === current ? " active" : ""}`}
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
            >
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomGallery;
