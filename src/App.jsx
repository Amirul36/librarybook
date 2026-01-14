import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Recommendations from "./pages/Recommendations";
import AllBooks from "./pages/AllBooks";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import Reservations from "./pages/Reservations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container-fluid px-4 py-4">
        <Routes>
          <Route path="/" element={<Recommendations />} />
          <Route path="/all" element={<AllBooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}