import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function GuestLayout() {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default GuestLayout;
