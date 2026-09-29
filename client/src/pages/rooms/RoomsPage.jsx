import { useEffect, useState } from "react";
import api from "../../services/api";
import RoomCard from "../../components/rooms/RoomCard";
import RoomFilters from "../../components/rooms/RoomFilters";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    roomType: "",
    capacity: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit: 9, ...filters };
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });

        const res = await api.get("/rooms", { params });
        setRooms(res.data.rooms);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError(err.userMessage || "Unable to load rooms right now.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRooms, 350); // small debounce for the search field
    return () => clearTimeout(timer);
  }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="container section">
      <p className="eyebrow mb-2">Our rooms</p>
      <h1 className="mb-5">Find your room</h1>

      <RoomFilters filters={filters} onChange={handleFilterChange} />

      {loading && <Loading label="Loading rooms..." />}
      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => setFilters({ ...filters })}
        />
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="state-message surface">
          <h4>No rooms found</h4>
          <p className="mb-0">Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && !error && rooms.length > 0 && (
        <>
          <div className="row g-4">
            {rooms.map((room) => (
              <div className="col-md-4" key={room._id}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default RoomsPage;
