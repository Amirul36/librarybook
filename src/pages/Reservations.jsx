import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyReservations, cancelReservation, completeReservation } from "../api/reservationsApi";

export default function Reservations() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const data = await getMyReservations();
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function onCancel(id) {
    try {
      setError("");
      await cancelReservation(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onComplete(id) {
    try {
      setError("");
      await completeReservation(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function badgeClass(status) {
    if (status === "ACTIVE") return "bg-success";
    if (status === "WAITING") return "bg-warning text-dark";
    if (status === "COMPLETED") return "bg-primary";
    return "bg-secondary"; // CANCELLED
  }

  return (
    <div>
      <h3 className="mb-3">My Reservations</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {items.map((r) => (
          <div className="col-md-4" key={r._id}>
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  {r.bookId?.coverUrl ? (
                    <div className="book-cover">
                      <img src={r.bookId.coverUrl} alt={r.bookId.title} />
                    </div>
                  ) : (
                    <div className="book-cover text-muted">No Cover</div>
                  )}
                </div>

                <h5 className="card-title">{r.bookId?.title}</h5>
                <div className="text-muted">{r.bookId?.author}</div>

                <div className="mt-2 small">
                  {r.bookId?.categoryIds?.map((c) => c.name).join(", ")}
                </div>

                <div className="mt-2 d-flex align-items-center gap-2">
                  <span className={`badge ${badgeClass(r.status)}`}>{r.status}</span>
                  {r.status === "WAITING" && (
                    <span className="small text-muted">Queue: {r.position}</span>
                  )}
                </div>
              </div>

              <div className="card-footer bg-white d-flex gap-2">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/books/${r.bookId?._id}`}
                  state={{ from: "/reservations" }}
                >
                  View
                </Link>

                {(r.status === "ACTIVE" || r.status === "WAITING") && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => onCancel(r._id)}>
                    Cancel
                  </button>
                )}

                {r.status === "ACTIVE" && (
                  <button className="btn btn-success btn-sm" onClick={() => onComplete(r._id)}>
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!error && items.length === 0 && (
        <div className="alert alert-info mt-3">No reservations yet.</div>
      )}
    </div>
  );
}
