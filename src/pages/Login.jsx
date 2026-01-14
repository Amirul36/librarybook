import { useState } from "react";
import { loginUser } from "../api/authApi";
import { getMe } from "../api/usersApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const data = await loginUser({ email, password });

      //store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);

      //where to go next
      const me = await getMe();
      navigate(me.hasOnboarded ? "/" : "/onboarding");
    } catch (err) {
      //clear stale auth so navbar doesn't lie
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");

      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <h3 className="mb-3">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
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
            placeholder="Your password"
            autoComplete="current-password"
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-3 small">
          No account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}