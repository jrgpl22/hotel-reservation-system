import { Link } from "react-router-dom";
import { BRAND_NAME } from "../utils/constants";

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-md-5">
            <p className="font-display fs-4 mb-2" style={{ color: "#F7F3EA" }}>
              {BRAND_NAME}
            </p>
            <p
              className="text-small mb-0"
              style={{ color: "#C7CFCB", maxWidth: "38ch" }}
            >
              A quiet place to stay, thoughtfully designed for a comfortable and
              memorable visit.
            </p>
          </div>

          <div className="col-md-3">
            <p
              className="text-small fw-semibold mb-3"
              style={{ color: "#F7F3EA" }}
            >
              Explore
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/rooms" className="footer-link">
                  Rooms
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="footer-link">
                  My reservations
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <p
              className="text-small fw-semibold mb-3"
              style={{ color: "#F7F3EA" }}
            >
              Contact
            </p>
            <p className="text-small mb-1" style={{ color: "#C7CFCB" }}>
              123 Harbor Street, Imus, Cavite
            </p>
            <p className="text-small mb-0" style={{ color: "#C7CFCB" }}>
              reservations@hearts.com
            </p>
          </div>
        </div>

        <hr
          style={{
            borderColor: "rgba(247,243,234,0.15)",
            margin: "2rem 0 1.5rem",
          }}
        />

        <p className="text-small mb-0" style={{ color: "#8FA39C" }}>
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
