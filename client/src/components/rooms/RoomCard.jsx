import { Link } from "react-router-dom";
import {
  resolveImageUrl,
  getRoomImages,
  FALLBACK_ROOM_IMAGE,
} from "../../utils/images";

function RoomCard({ room }) {
  const imageUrl = resolveImageUrl(getRoomImages(room)[0], {
    width: 600,
    fallback: FALLBACK_ROOM_IMAGE,
  });

  return (
    <div className="card card-hover h-100">
      <img src={imageUrl} alt={room.roomType} className="card-img-top" />
      <div className="card-body">
        <h3 className="card-title">{room.roomType}</h3>
        <p className="text-muted-custom text-small mb-3">
          {room.capacity} guests · {room.bedType || "Standard bed"} · Room{" "}
          {room.roomNumber}
        </p>
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-semibold">
            ₱{room.pricePerNight?.toLocaleString()}{" "}
            <span className="text-small text-muted-custom">/ night</span>
          </span>
          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-outline-primary btn-sm"
          >
            View room
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
