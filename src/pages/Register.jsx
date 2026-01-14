import { useState } from "react";
import { registerUser } from "../api/authApi";
import { getMe } from "../api/usersApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const data = await registerUser({ name, email, password });

      //store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);

      //new users go onboarding,
      //check the real flag from DB
      const me = await getMe();
      navigate(me.hasOnboarded ? "/" : "/onboarding");
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");

      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <h3 className="mb-3">Sign up</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <label className="form-label">Name</label>
          <input
            className="form-control mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />

          <label className="form-label">Email</label>
          <input
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label className="form-label">Password</label>
          <input
            className="form-control mb-3"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            autoComplete="new-password"
          />

          <button className="btn btn-warning w-100" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-3 small">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}