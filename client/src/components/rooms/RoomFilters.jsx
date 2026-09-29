const ROOM_TYPES = [
  "Standard Room",
  "Garden Deluxe",
  "Executive Suite",
  "Family Room",
];

function RoomFilters({ filters, onChange }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="surface p-4 mb-5">
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Search</label>
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Room type, number..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Room type</label>
          <select
            name="roomType"
            className="form-select"
            value={filters.roomType}
            onChange={handleChange}
          >
            <option value="">Any type</option>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Guests</label>
          <select
            name="capacity"
            className="form-select"
            value={filters.capacity}
            onChange={handleChange}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Max price / night</label>
          <input
            type="number"
            name="maxPrice"
            className="form-control"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}

export default RoomFilters;
