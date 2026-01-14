import { useEffect, useState } from "react";
import { getRecommendedBooks } from "../api/booksApi";
import { Link, useNavigate } from "react-router-dom";

export default function Recommendations() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const data = await getRecommendedBooks();
      setBooks(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Recommendations</h3>
        <Link className="btn btn-outline-secondary btn-sm" to="/all">
          View all books
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && books.length === 0 && (
        <div className="alert alert-info">
          No recommendations found. Make sure you selected interests during onboarding.
        </div>
      )}

      <div className="row g-3">
        {books.map((b) => (
          <div className="col-md-4" key={b._id}>
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  {b.coverUrl ? (
                    <div className="book-cover">
                      <img src={b.coverUrl} alt={b.title} />
                    </div>
                  ) : (
                    <div className="book-cover text-muted">No Cover</div>
                  )}
                </div>

                <h5 className="card-title">{b.title}</h5>
                <div className="text-muted">{b.author}</div>

                <div className="mt-2 small">
                  {b.categoryIds?.map((c) => c.name).join(", ")}
                </div>

                <div className="mt-2 small text-muted">
                  Copies: {b.availableCopies}/{b.totalCopies} • Location: {b.location} • Call No: {b.callNumber}
                </div>

                <div className="mt-2">
                  <span className={`badge ${b.availableCopies > 0 ? "bg-success" : "bg-secondary"}`}>
                    {b.availableCopies > 0 ? "Available" : "No copies"}
                  </span>
                </div>
              </div>

              <div className="card-footer bg-white">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/books/${b._id}`}
                  state={{ from: "/" }}
                >
                  View
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}