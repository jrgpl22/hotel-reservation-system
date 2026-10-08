import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { formatPeso, addDaysISO } from "./reservationHelpers";
import DateRangePicker from "./DateRangePicker";

const smallLabel = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function BookingForm({ room, onBooked }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [bookedRanges, setBookedRanges] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const datesReady = checkIn && checkOut && checkOut > checkIn;

  // Taken dates for this room, used to block them in the calendar.
  // If this fails, the backend still rejects conflicting bookings.
  useEffect(() => {
    let cancelled = false;
    const loadBooked = async () => {
      try {
        const res = await api.get("/reservations/booked", { params: { room: room._id } });
        if (!cancelled) setBookedRanges(res.data.ranges);
      } catch {
        if (!cancelled) setBookedRanges([]);
      }
    };
    loadBooked();
    return () => {
      cancelled = true;
    };
  }, [room._id]);

  // Every booked night as "YYYY-MM-DD". A check-out day is not a booked night.
  const bookedNights = useMemo(() => {
    const nights = new Set();
    bookedRanges.forEach((range) => {
      let day = range.checkIn.slice(0, 10);
      const last = range.checkOut.slice(0, 10);
      while (day < last) {
        nights.add(day);
        day = addDaysISO(day, 1);
      }
    });
    return nights;
  }, [bookedRanges]);

  // Live availability + price preview. The backend does the real calculation.
  useEffect(() => {
    setAvailability(null);
    setError("");

    if (!datesReady) return;

    let cancelled = false;
    setChecking(true);

    const timer = setTimeout(async () => {
      try {
        const res = await api.get("/reservations/availability", {
          params: { room: room._id, checkIn, checkOut, guests },
        });
        if (!cancelled) setAvailability(res.data);
      } catch (err) {
        if (!cancelled) {
          setAvailability(null);
          setError(err.userMessage || "Unable to check availability.");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [room._id, checkIn, checkOut, guests, datesReady]);

  const handleDatesChange = ({ checkIn: nextIn, checkOut: nextOut }) => {
    setCheckIn(nextIn);
    setCheckOut(nextOut);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability?.available) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/reservations", {
        room: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });
      onBooked(res.data.reservation);
    } catch (err) {
      setAvailability(null);
      setError(err.userMessage || "Unable to create your reservation.");
      setSubmitting(false);
    }
  };

  const guestOptions = Array.from({ length: room.capacity || 1 }, (_, i) => i + 1);
  const unavailable = availability && availability.available === false;
  const available = availability?.available === true;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="mb-3">
        <span className="fs-4 fw-semibold">{formatPeso(room.pricePerNight)}</span>{" "}
        <span className="text-muted-custom">/ night</span>
      </p>

      <div
        className="mb-4"
        style={{
          border: "1px solid var(--bs-border-color)",
          borderRadius: "var(--bs-border-radius-lg, 12px)",
        }}
      >
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          bookedNights={bookedNights}
          onChange={handleDatesChange}
        />

        <div
          style={{
            borderTop: "1px solid var(--bs-border-color)",
            padding: "var(--space-3)",
          }}
        >
          <label className="form-label mb-0" htmlFor="guests" style={smallLabel}>
            Guests
          </label>
          <select
            id="guests"
            className="form-select"
            style={{ border: 0, paddingLeft: 0, boxShadow: "none" }}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {guestOptions.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4" style={{ minHeight: 72 }}>
        {!datesReady && (
          <p className="text-small text-muted-custom mb-0">
            Choose your dates to see availability and the total price.
          </p>
        )}

        {datesReady && checking && (
          <p className="text-small text-muted-custom mb-0">Checking availability...</p>
        )}

        {datesReady && !checking && available && (
          <div>
            <p className="text-small text-muted-custom mb-1">
              {availability.nights} {availability.nights === 1 ? "night" : "nights"} &times;{" "}
              {formatPeso(availability.pricePerNight)}
            </p>
            <p className="fw-semibold fs-4 mb-0">
              Total: {formatPeso(availability.totalAmount)}
            </p>
          </div>
        )}

        {datesReady && !checking && unavailable && (
          <p className="invalid-feedback d-block mb-0">{availability.message}</p>
        )}

        {datesReady && !checking && error && (
          <p className="invalid-feedback d-block mb-0">{error}</p>
        )}
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-100 ${submitting ? "btn-loading" : ""}`}
        disabled={!available || checking || submitting}
      >
        Confirm booking
      </button>
      <p className="text-small text-muted-custom text-center mt-2 mb-0">
        You won&apos;t be charged yet
      </p>
    </form>
  );
}

export default BookingForm;