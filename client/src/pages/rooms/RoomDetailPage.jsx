import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { resolveImageUrl, FALLBACK_ROOM_IMAGE } from "../../utils/images";

function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        setError(err.userMessage || "Unable to load this room.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading)
    return (
      <div className="container section">
        <Loading label="Loading room..." />
      </div>
    );
  if (error)
    return (
      <div className="container section">
        <ErrorMessage message={error} />
      </div>
    );
  if (!room) return null;

  const imageUrl = resolveImageUrl(room.image, {
    width: 1200,
    fallback: FALLBACK_ROOM_IMAGE,
  });

  return (
    <div className="container section">
      <img
        src={imageUrl}
        alt={room.roomType}
        className="w-100 mb-4"
        style={{
          borderRadius: "var(--radius-lg)",
          maxHeight: 420,
          objectFit: "cover",
        }}
      />

      <div className="row g-5">
        <div className="col-md-7">
          <p className="eyebrow mb-2">Room {room.roomNumber}</p>
          <h1 className="mb-3">{room.roomType}</h1>
          <StatusBadge status={room.status} />
          <p className="mt-4 text-muted-custom">{room.description}</p>

          <h4 className="mt-5 mb-3">Amenities</h4>
          <ul className="list-unstyled row row-cols-2 g-2">
            {room.amenities?.map((item) => (
              <li key={item} className="col text-small">
                ✓ {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-5">
          <div className="surface p-4">
            <p className="fw-semibold fs-4 mb-1">
              ₱{room.pricePerNight?.toLocaleString()}{" "}
              <span className="text-small text-muted-custom fw-normal">
                / night
              </span>
            </p>
            <p className="text-small text-muted-custom mb-4">
              {room.capacity} guests · {room.bedType || "Standard bed"}
            </p>

            {room.status === "available" ? (
              <Link
                to="/reservations/book"
                state={{ roomId: room._id }}
                className="btn btn-primary w-100"
              >
                Check availability
              </Link>
            ) : (
              <button className="btn btn-outline-primary w-100" disabled>
                Currently unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetailPage;
