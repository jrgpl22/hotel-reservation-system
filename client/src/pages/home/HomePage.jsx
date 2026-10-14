import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function HomePage() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setApiStatus(res.data.database === "connected"))
      .catch(() => setApiStatus(false));
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
            A quiet place to stay, in the middle of everything.
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
          <p className="eyebrow mb-2">Featured rooms</p>
          <h2 className="mb-5">A room for every kind of stay</h2>

          <div className="row g-4">
            {[
              {
                name: "Garden Deluxe",
                price: "₱4,500",
                img: "photo-1611892440504-42a792e24d32",
              },
              {
                name: "Executive Suite",
                price: "₱6,800",
                img: "photo-1611892440504-42a792e24d32",
              },
              {
                name: "Family Room",
                price: "₱5,200",
                img: "photo-1590490360182-c33d57733427",
              },
            ].map((room) => (
              <div className="col-md-4" key={room.name}>
                <div className="card card-hover h-100">
                  <img
                    src={`https://images.unsplash.com/${room.img}?auto=format&fit=crop&w=600&q=80`}
                    alt={room.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h3 className="card-title">{room.name}</h3>
                    <p className="text-muted-custom text-small mb-3">
                      2 guests · Queen bed · Free Wi-Fi
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold">
                        {room.price}{" "}
                        <span className="text-small text-muted-custom">
                          / night
                        </span>
                      </span>
                      <Link
                        to="/rooms"
                        className="btn btn-outline-primary btn-sm"
                      >
                        View room
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* {apiStatus !== null && (
        <p className="text-center text-small text-muted-custom pb-4">
          {apiStatus
            ? "System status: all services connected"
            : "System status: unable to reach the server"}
        </p>
      )} */}
    </>
  );
}

export default HomePage;
