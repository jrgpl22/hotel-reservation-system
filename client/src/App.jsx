import { Routes, Route } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RoomsPage from "./pages/rooms/RoomsPage";
import RoomDetailPage from "./pages/rooms/RoomDetailPage";
import ReservationsPage from "./pages/reservations/ReservationsPage";
import BookReservationPage from "./pages/reservations/BookReservationPage";
import ReservationDetailPage from "./pages/reservations/ReservationDetailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import { USER_ROLES } from "./utils/constants";

function App() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />

        {/* Any signed-in role */}
        <Route element={<ProtectedRoute />}>
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reservations/book" element={<BookReservationPage />} />
          <Route path="/reservations/:id" element={<ReservationDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Staff and admin share the admin shell */}
      <Route
        element={
          <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.STAFF]} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route
            path="/admin/reservations"
            element={<AdminReservationsPage />}
          />
          <Route path="/admin/profile" element={<AdminProfilePage />} />

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={[USER_ROLES.ADMIN]} />}>
            <Route path="/admin/rooms" element={<AdminRoomsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
