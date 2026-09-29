import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
  const location = useLocation();

  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <main
        className="flex-grow-1 p-4 p-md-5"
        style={{ background: "var(--color-background)" }}
      >
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
