import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Toast from "../../components/Toast";
import StatCard from "../../components/admin/dashboard/StatCard";
import RoomSummary from "../../components/admin/dashboard/RoomSummary";
import ReservationSummary from "../../components/admin/dashboard/ReservationSummary";
import RecentReservations from "../../components/admin/dashboard/RecentReservations";
import QuickActions from "../../components/admin/dashboard/QuickActions";

function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const fetchDashboard = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const [statsRes, recentRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-reservations", { params: { limit: 5 } }),
      ]);
      setStats(statsRes.data.stats);
      setRecentReservations(recentRes.data.reservations);
      if (isManualRefresh)
        setToast({ message: "Dashboard refreshed", type: "success" });
    } catch (err) {
      const message = err.userMessage || "Unable to load the dashboard.";
      // On a manual refresh keep the data on screen and just tell the user it failed
      if (isManualRefresh) setToast({ message, type: "error" });
      else setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div>
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-5">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted-custom mb-0">
            Welcome back, {firstName}. Here is what is happening at the hotel.
          </p>
        </div>
        <button
          className={`btn btn-outline-primary btn-sm ${refreshing ? "btn-loading" : ""}`}
          onClick={() => fetchDashboard(true)}
          disabled={loading || refreshing}
        >
          Refresh
        </button>
      </div>

      {loading && <Loading label="Loading dashboard..." />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => fetchDashboard()} />
      )}

      {!loading && !error && stats && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Total rooms"
                value={stats.rooms.total}
                hint="All rooms in the system"
                delay={0}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Available rooms"
                value={stats.rooms.available}
                hint="Open for booking"
                tone="success"
                delay={60}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Under maintenance"
                value={stats.rooms.maintenance}
                hint="Temporarily out of service"
                tone="warning"
                delay={120}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Total reservations"
                value={stats.reservations.total}
                hint="Across all statuses"
                delay={180}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Pending"
                value={stats.reservations.pending}
                hint="Awaiting confirmation"
                tone="warning"
                delay={240}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                label="Confirmed"
                value={stats.reservations.confirmed}
                hint="Confirmed by staff"
                tone="success"
                delay={300}
              />
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <RoomSummary rooms={stats.rooms} />
            </div>
            <div className="col-lg-6">
              <ReservationSummary reservations={stats.reservations} />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-xl-8">
              <RecentReservations reservations={recentReservations} />
            </div>
            <div className="col-xl-4">
              <QuickActions pendingCount={stats.reservations.pending} />
            </div>
          </div>
        </>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default AdminDashboardPage;
