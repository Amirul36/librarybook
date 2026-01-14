import { useEffect, useState } from "react";
import { getBooks, getCategories } from "../api/booksApi";
import { Link } from "react-router-dom";

export default function AllBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const data = await getBooks({
        search: search.trim(),
        categoryId,
        available: available ? "true" : "",
        sort: "title",
      });
      setBooks(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        await load();
      } catch (e) {
        setError(e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="mb-3">All Books</h3>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-5">
          <label className="form-label">Search</label>
          <input
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <div className="form-check mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              id="available"
            />
            <label className="form-check-label" htmlFor="available">
              Available only
            </label>
          </div>
        </div>

        <div className="col-md-1 d-grid">
          <button className="btn btn-primary" onClick={load}>
            Go
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

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
                  state={{ from: "/all" }}
                >
                  View
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>

      {!error && books.length === 0 && (
        <div className="alert alert-info mt-3">No results. Try another search/filter.</div>
      )}
    </div>
  );
}