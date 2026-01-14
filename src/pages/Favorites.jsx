import { useEffect, useState } from "react";
import { getMyFavorites, removeFavorite } from "../api/favouriteApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Favorite(){
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("")

  async function load(){
    try {
      setError("");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const data = await getMyFavorites();
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function onRemove(id){
    try{
      await removeFavorite(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    //loads the eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="mb-3">My Favorites</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {items.map((f) => (
          <div className="col-md-4" key={f._id}>
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  {f.bookId?.coverUrl ? (
                    <div className="book-cover">
                      <img src={f.bookId.coverUrl} alt={f.bookId.title} />
                    </div>
                  ) : (
                    <div className="book-cover text-muted">No Cover</div>
                  )}
                </div>

                <h5 className="card-title">{f.bookId?.title}</h5>
                <div className="text-muted">{f.bookId?.author}</div>
                <div className="mt-2 small">
                  {f.bookId?.categoryIds?.map((c) => c.name).join(", ")}
                </div>
              </div>
              <div className="card-footer bg-white d-flex gap-2">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/books/${f.bookId?._id}`}
                  state={{ from: "/favorites" }}
                >
                  View
                </Link>

                <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(f._id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!error && items.length === 0 && (
        <div className="alert alert-info mt-3">Empty? Go add some favorite boks now!</div>
      )}
    </div>
  )
}