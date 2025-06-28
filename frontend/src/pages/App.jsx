import {
  NavLink,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Container from "../component/Container";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import "../index.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-end gap-4 mb-4">
        {location.pathname === "/container" ? (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className="text-blue-600 hover:underline">
              Login
            </NavLink>
            <NavLink to="/register" className="text-blue-600 hover:underline">
              Register
            </NavLink>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/container" element={<Container />} />
      </Routes>
    </div>
  );
}

export default App;
