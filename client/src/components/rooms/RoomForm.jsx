import { useState, useEffect } from "react";
import ImageUploader from "../ImageUploader";
const EMPTY_FORM = {
  roomNumber: "",
  roomType: "",
  description: "",
  pricePerNight: "",
  capacity: "",
  bedType: "",
  amenities: "",
  image: "",
  status: "available",
};

function RoomForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        amenities: (initialData.amenities || []).join(", "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.roomNumber.trim()) errs.roomNumber = "Room number is required";
    if (!form.roomType.trim()) errs.roomType = "Room type is required";
    if (!form.pricePerNight || Number(form.pricePerNight) < 0)
      errs.pricePerNight = "Enter a valid price";
    if (!form.capacity || Number(form.capacity) < 1)
      errs.capacity = "Capacity must be at least 1";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...form,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Room number</label>
          <input
            type="text"
            name="roomNumber"
            className={`form-control ${errors.roomNumber ? "is-invalid" : ""}`}
            value={form.roomNumber}
            onChange={handleChange}
          />
          {errors.roomNumber && (
            <div className="invalid-feedback d-block">{errors.roomNumber}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Room type</label>
          <input
            type="text"
            name="roomType"
            className={`form-control ${errors.roomType ? "is-invalid" : ""}`}
            value={form.roomType}
            onChange={handleChange}
          />
          {errors.roomType && (
            <div className="invalid-feedback d-block">{errors.roomType}</div>
          )}
        </div>
        <div className="col-12">
          <ImageUploader
            kind="room"
            label="Room photo"
            value={form.image}
            onChange={(path) => setForm({ ...form, image: path })}
            hint="JPG, PNG, or WebP. Large photos are resized automatically."
          />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows={2}
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Price / night</label>
          <input
            type="number"
            name="pricePerNight"
            className={`form-control ${errors.pricePerNight ? "is-invalid" : ""}`}
            value={form.pricePerNight}
            onChange={handleChange}
            min={0}
          />
          {errors.pricePerNight && (
            <div className="invalid-feedback d-block">
              {errors.pricePerNight}
            </div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            name="capacity"
            className={`form-control ${errors.capacity ? "is-invalid" : ""}`}
            value={form.capacity}
            onChange={handleChange}
            min={1}
          />
          {errors.capacity && (
            <div className="invalid-feedback d-block">{errors.capacity}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Bed type</label>
          <input
            type="text"
            name="bedType"
            className="form-control"
            value={form.bedType}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">Amenities (comma-separated)</label>
          <input
            type="text"
            name="amenities"
            className="form-control"
            placeholder="Wi-Fi, Air Conditioning, TV"
            value={form.amenities}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary btn-sm ${loading ? "btn-loading" : ""}`}
          disabled={loading}
        >
          {initialData ? "Save changes" : "Add room"}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;
