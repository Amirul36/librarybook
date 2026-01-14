import { useEffect, useState } from "react";
import { getCategories } from "../api/booksApi";
import { getMe, saveInterests } from "../api/usersApi";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        //block access if already onboarded
        const me = await getMe();
        if (me.hasOnboarded) return navigate("/");

        const cats = await getCategories();
        setCategories(cats);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  function toggle(id) {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  }

  async function onSave() {
    try {
      setError("");
      const ids = Array.from(selected);

      if (ids.length < 1) return setError("Select at least 1 category.");
      if (ids.length > 5) return setError("Select up to 5 categories.");

      setSaving(true);
      await saveInterests(ids);
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card">
          <div className="card-body">
            <h3 className="mb-2">Choose your interests</h3>
            <p className="text-muted mb-3">
              Pick categories you like. We’ll use them to show recommendations.
              (You can select 1 to 5)
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-2">
              {categories.map((c) => (
                <div className="col-12 col-md-6" key={c._id}>
                  <label className="border rounded p-3 w-100 d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.has(c._id)}
                      onChange={() => toggle(c._id)}
                    />
                    <div>
                      <div className="fw-semibold">{c.name}</div>
                      {c.description && <div className="small text-muted">{c.description}</div>}
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save interests"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}