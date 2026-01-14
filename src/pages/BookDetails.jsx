import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBookById } from "../api/booksApi";
import { addFavorite } from "../api/favouriteApi";
import { createReservation } from "../api/reservationsApi";
import { useLocation } from "react-router-dom";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  const [favMsg, setFavMsg] = useState("");
  const [resMsg, setResMsg] = useState("");

  const location = useLocation();
  const backTo = location.state?.from || "/all";


  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await getBookById(id);
        setBook(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  async function onFavorite() {
    try {
      setFavMsg("");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      await addFavorite(book._id);
      setFavMsg("Added to favorites!");
    } catch (e) {
      setFavMsg(e.message);
    }
  }

  async function onReserve() {
    try {
      setResMsg("");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const r = await createReservation(book._id);
      setResMsg(r.status === "ACTIVE" ? "Reserved successfully!" : "No copies. Added to waiting list.");

      // refresh book details so availableCopies updates
      const updated = await getBookById(id);
      setBook(updated);
    } catch (e) {
      setResMsg(e.message);
    }
  }

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!book) return <div>Loading...</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10">
        <div className="card">
          <div className="card-body">
            <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate(backTo)}>
              Back
            </button>

            {book.coverUrl ? (
              <div className="book-cover book-cover--details">
                <img src={book.coverUrl} alt={book.title} />
              </div>
            ) : null}

            <h3>{book.title}</h3>
            <div className="text-muted">{book.author}</div>

            <div className="mt-2 small">
              {book.categoryIds?.map((c) => c.name).join(", ")}
            </div>

            <div className="mt-3">{book.description}</div>

            <div className="mt-2 small text-muted">
              Copies: {book.availableCopies}/{book.totalCopies}
              </div>

            <div className="mt-3">
              <div><strong>Location:</strong> {book.location}</div>
              <div><strong>Call Number:</strong> {book.callNumber}</div>
            </div>

            <div className="mt-3">
              <span className={`badge ${book.availableCopies > 0 ? "bg-success" : "bg-secondary"}`}>
                {book.availableCopies > 0 ? "Available" : "No copies"}
              </span>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={onReserve}>
                Reserve
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={onFavorite}>
                Favorite
              </button>
            </div>

            {resMsg && <div className="alert alert-info mt-3 mb-0">{resMsg}</div>}
            {favMsg && <div className="alert alert-info mt-3 mb-0">{favMsg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}