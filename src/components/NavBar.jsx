import { Link, NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ShelfSpace
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Recommendations
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/all">
                All Books
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favorites">
                Favorites
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/reservations">
                Reservations
              </NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {token ? (
              <>
                <span className="text-light small">Hi, {userName || "User"}</span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-warning btn-sm" to="/register">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}