import { Link } from "react-router-dom";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80";

function RoomCard({ room }) {
  const imageUrl = room.image?.startsWith("http")
    ? room.image
    : room.image
      ? `https://images.unsplash.com/${room.image}?auto=format&fit=crop&w=600&q=80`
      : FALLBACK_IMG;

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
