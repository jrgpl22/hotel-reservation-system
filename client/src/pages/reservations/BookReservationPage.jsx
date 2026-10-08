import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { ROOM_STATUS } from "../../utils/constants";
import BookingForm from "./BookingForm";
import StatusBadge from "../../components/StatusBadge";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { formatPeso } from "./reservationHelpers";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80";

function BookReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // RoomDetailPage sends the room id through router state.
  // "?room=<id>" also works, e.g. if someone opens the link directly.
  const roomId = location.state?.roomId || searchParams.get("room");

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data.room);
      } catch (err) {
        setError(err.userMessage || "Unable to load this room.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBooked = (reservation) => {
    navigate(`/reservations/${reservation._id}`, { state: { justBooked: true } });
  };

  if (!roomId) {
    return (
      <div className="container section">
        <div className="state-message surface">
          <h4>No room selected</h4>
          <p className="mb-3">Pick a room first, then come back to choose your dates.</p>
          <Link to="/rooms" className="btn btn-primary btn-sm">Browse rooms</Link>
        </div>
      </div>
    );
  }

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

  if (room.status === ROOM_STATUS.MAINTENANCE) {
    return (
      <div className="container section">
        <div className="state-message surface">
          <h4>This room is unavailable</h4>
          <p className="mb-3">It is currently under maintenance. Please choose another room.</p>
          <Link to="/rooms" className="btn btn-primary btn-sm">Browse rooms</Link>
        </div>
      </div>
    );
  }

  const imageUrl = room.image?.startsWith("http")
    ? room.image
    : room.image
      ? `https://images.unsplash.com/${room.image}?auto=format&fit=crop&w=1200&q=80`
      : FALLBACK_IMG;

  return (
    <div className="container section">
      <p className="eyebrow mb-2">Book a room</p>
      <h1 className="mb-5">Reserve your stay</h1>

      <div className="row g-5">
        <div className="col-md-7">
          <img
            src={imageUrl}
            alt={room.roomType}
            className="w-100 mb-4"
            style={{ borderRadius: "var(--radius-lg)", maxHeight: 320, objectFit: "cover" }}
          />
          <p className="eyebrow mb-2">Room {room.roomNumber}</p>
          <h2 className="mb-2">{room.roomType}</h2>
          <StatusBadge status={room.status} />
          <p className="mt-3 text-muted-custom">{room.description}</p>
          <p className="text-small text-muted-custom mb-0">
            {room.capacity} guests &middot; {room.bedType || "Standard bed"}
          </p>
        </div>

        <div className="col-md-5">
          <div className="surface p-4">
            <p className="fw-semibold fs-4 mb-4">
              {formatPeso(room.pricePerNight)}{" "}
              <span className="text-small text-muted-custom fw-normal">/ night</span>
            </p>
            <BookingForm room={room} onBooked={handleBooked} />
          </div>
          <Link to={`/rooms/${room._id}`} className="btn btn-outline-primary btn-sm mt-3">
            Back to room
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookReservationPage;