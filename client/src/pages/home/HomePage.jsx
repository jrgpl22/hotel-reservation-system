import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import RoomCard from "../../components/rooms/RoomCard";
import EmptyState from "../../components/EmptyState";

// One room of each type is shown, in this order.
// The names must match the room types stored in the database.
const FEATURED_ROOM_TYPES = ["Standard Room", "Family Room", "Executive Suite"];

function RoomCardSkeleton() {
  return (
    <div className="card h-100" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: "4 / 3", borderRadius: 0 }} />
      <div className="card-body">
        <div className="skeleton mb-3" style={{ height: 24, width: "60%" }} />
        <div className="skeleton mb-4" style={{ height: 14, width: "85%" }} />
        <div className="skeleton" style={{ height: 32, width: "100%" }} />
      </div>
    </div>
  );
}

function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedRooms = async () => {
      // One request per type, so a failure for one type does not hide the others
      const results = await Promise.allSettled(
        FEATURED_ROOM_TYPES.map((roomType) =>
          api.get("/rooms", { params: { roomType, limit: 1 } }),
        ),
      );
      if (ignore) return;

      setRooms(
        results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value.data.rooms[0])
          .filter(Boolean),
      );
      setLoading(false);
    };

    fetchFeaturedRooms();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="container hero-content">
          <p className="eyebrow mb-2">Est. 2026</p>
          <h1 className="mb-3">
            Where every stay feels like heart, and every moment feels like home.
          </h1>
          <p className="mb-4" style={{ color: "#E4DECF" }}>
            Thoughtfully designed rooms, easy booking, and a team that takes
            care of the details.
          </p>
          <div className="d-flex gap-3">
            <Link to="/rooms" className="btn btn-accent">
              Explore rooms
            </Link>
            <Link
              to="/register"
              className="btn btn-outline-primary"
              style={{ borderColor: "#fff", color: "#fff" }}
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-5">
            <div>
              <p className="eyebrow mb-2">Featured rooms</p>
              <h2 className="mb-0">A room for every kind of stay</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-primary btn-sm">
              View all rooms
            </Link>
          </div>

          {loading ? (
            <div className="row g-4">
              {FEATURED_ROOM_TYPES.map((type) => (
                <div className="col-md-4" key={type}>
                  <RoomCardSkeleton />
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <EmptyState
              icon="rooms"
              title="Rooms are coming soon"
              message="We are getting our rooms ready. Please check back shortly."
            />
          ) : (
            <div className="row g-4">
              {rooms.map((room, index) => (
                <div
                  className="col-md-4 stagger-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                  key={room._id}
                >
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HomePage;