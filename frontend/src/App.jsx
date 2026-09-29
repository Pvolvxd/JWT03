import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserPage from "./pages/UserPage";
import ModeratorPage from "./pages/ModeratorPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/user"
          element={<UserPage />}
        />

        <Route
          path="/moderator"
          element={<ModeratorPage />}
        />

        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Routes>
    </>
  );
}

export default App;