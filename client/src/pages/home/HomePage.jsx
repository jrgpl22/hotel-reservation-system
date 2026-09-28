import { useEffect, useState } from "react";
import api from "../../services/api";

function HomePage() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) =>
        setStatus(`${res.data.message} (database: ${res.data.database})`),
      )
      .catch((error) => setStatus(error.userMessage));
  }, []);

  return (
    <div className="container py-5">
      <h1>Hotel Reservation System</h1>
      <p>{status}</p>
    </div>
  );
}

export default HomePage;
