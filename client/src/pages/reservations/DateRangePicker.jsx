import { useEffect, useMemo, useRef, useState } from "react";
import { todayISO, addDaysISO, formatDate } from "./reservationHelpers";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const BAND = "color-mix(in srgb, var(--color-primary) 14%, transparent)";

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const nightsBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const monthName = (y, m) =>
  new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// Leading nulls = empty cells before the 1st of the month
const buildMonth = (y, m) => {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const cells = Array(first).fill(null);
  for (let d = 1; d <= days; d++) cells.push(toISO(y, m, d));
  return cells;
};

const smallLabel = {
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const cellButton = {
  textAlign: "left",
  background: "transparent",
  border: 0,
  padding: "var(--space-3)",
  width: "100%",
  cursor: "pointer",
};

const arrowButton = {
  background: "transparent",
  border: 0,
  fontSize: "1.5rem",
  lineHeight: 1,
  width: 32,
  cursor: "pointer",
};

export default function DateRangePicker({ checkIn, checkOut, bookedNights, onChange }) {
  const today = todayISO();
  const wrapRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState("");
  const [wide, setWide] = useState(() => window.innerWidth >= 700);
  const [view, setView] = useState({
    y: Number(today.slice(0, 4)),
    m: Number(today.slice(5, 7)) - 1,
  });

  const selectingCheckOut = Boolean(checkIn) && !checkOut;

  // Furthest check-out allowed = the next booked night after check-in
  const maxCheckOut = useMemo(() => {
    if (!selectingCheckOut) return "";
    let cursor = checkIn;
    for (let i = 0; i < 366 && !bookedNights.has(cursor); i++) {
      cursor = addDaysISO(cursor, 1);
    }
    return bookedNights.has(cursor) ? cursor : "";
  }, [selectingCheckOut, checkIn, bookedNights]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 2 months on wide screens, 1 on phones
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 700);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openPicker = () => {
    if (checkIn) setView({ y: Number(checkIn.slice(0, 4)), m: Number(checkIn.slice(5, 7)) - 1 });
    setOpen(true);
  };

  const go = (delta) => {
    const d = new Date(Date.UTC(view.y, view.m + delta, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };
  const canGoPrev =
    view.y * 12 + view.m > Number(today.slice(0, 4)) * 12 + Number(today.slice(5, 7)) - 1;

  const isDisabled = (day) => {
    if (day < today) return true;
    if (selectingCheckOut && day > checkIn) return Boolean(maxCheckOut) && day > maxCheckOut;
    return bookedNights.has(day);
  };

  const pick = (day) => {
    if (isDisabled(day)) return;
    if (selectingCheckOut && day > checkIn) {
      onChange({ checkIn, checkOut: day });
    } else {
      onChange({ checkIn: day, checkOut: "" });
    }
  };

  // While choosing check-out, preview the range up to the hovered day
  const rangeEnd =
    checkOut || (selectingCheckOut && hover > checkIn && !isDisabled(hover) ? hover : "");

  const next = new Date(Date.UTC(view.y, view.m + 1, 1));
  const months = wide
    ? [view, { y: next.getUTCFullYear(), m: next.getUTCMonth() }]
    : [view];

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const renderMonth = ({ y, m }, index) => (
    <div key={`${y}-${m}`} style={{ flex: 1, minWidth: 0 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        {index === 0 ? (
          <button
            type="button"
            aria-label="Previous month"
            style={{ ...arrowButton, visibility: canGoPrev ? "visible" : "hidden" }}
            onClick={() => go(-1)}
          >
            &lsaquo;
          </button>
        ) : (
          <span style={{ width: 32 }} />
        )}
        <strong>{monthName(y, m)}</strong>
        {index === months.length - 1 ? (
          <button type="button" aria-label="Next month" style={arrowButton} onClick={() => go(1)}>
            &rsaquo;
          </button>
        ) : (
          <span style={{ width: 32 }} />
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: 2 }}>
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-small text-muted-custom">
            {w}
          </div>
        ))}

        {buildMonth(y, m).map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;

          const disabled = isDisabled(day);
          const selected = day === checkIn || day === checkOut;
          const inRange = checkIn && rangeEnd && day > checkIn && day < rangeEnd;
          const hovered = !selected && !disabled && day === hover;

          return (
            <div key={day} style={{ background: inRange ? BAND : "transparent" }}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => pick(day)}
                onMouseEnter={() => setHover(day)}
                onMouseLeave={() => setHover("")}
                style={{
                  display: "block",
                  margin: "0 auto",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2px solid ${hovered ? "var(--color-primary)" : "transparent"}`,
                  background: selected ? "var(--color-primary)" : "transparent",
                  color: selected
                    ? "#fff"
                    : disabled
                    ? "var(--color-text-muted)"
                    : "inherit",
                  textDecoration: disabled ? "line-through" : "none",
                  fontWeight: selected ? 700 : 500,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {Number(day.slice(8))}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <button type="button" style={cellButton} aria-expanded={open} onClick={openPicker}>
          <div style={smallLabel}>Check-in</div>
          <div className={checkIn ? "" : "text-muted-custom"}>
            {checkIn ? formatDate(checkIn) : "Add date"}
          </div>
        </button>
        <button
          type="button"
          style={{ ...cellButton, borderLeft: "1px solid var(--bs-border-color)" }}
          aria-expanded={open}
          onClick={openPicker}
        >
          <div style={smallLabel}>Check-out</div>
          <div className={checkOut ? "" : "text-muted-custom"}>
            {checkOut ? formatDate(checkOut) : "Add date"}
          </div>
        </button>
      </div>

      {open && (
        <div
          className="surface p-4 shadow"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 1050,
            width: wide ? 660 : "100%",
          }}
        >
          <div className="mb-3">
            <h3 className="h5 mb-1">
              {checkIn && checkOut
                ? `${nights} ${nights === 1 ? "night" : "nights"}`
                : selectingCheckOut
                ? "Select check-out date"
                : "Select check-in date"}
            </h3>
            <p className="text-small text-muted-custom mb-0">
              {checkIn && checkOut
                ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                : "Add your travel dates"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 24 }}>{months.map(renderMonth)}</div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => onChange({ checkIn: "", checkOut: "" })}
            >
              Clear dates
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}