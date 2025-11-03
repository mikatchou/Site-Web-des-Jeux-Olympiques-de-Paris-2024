import "./styles/variables.css";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Home from "./pages/Home"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound";
import Registered from "./pages/Registered";
import Activation from "./pages/Activation";
import Login from "./pages/Login";
import { ACCESS_TOKEN } from "./constants";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/AuthProvider";

function Logout () {
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("first_name");
    setUser(null);
  }, [setUser]);

  return <Navigate to="/" />;
}

function RegisterAndLogout () {
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("first_name");
    setUser(null);
  }, [setUser]);

  return <Register />;
}

function App() {
  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inscription" element={<RegisterAndLogout />} />
            <Route path="/inscription/confirmation" element={<Registered />} />
            <Route path="/activation/:token" element={<Activation />} />
            <Route path="/connexion/" element={<Login />} />
            <Route path="/deconnexion" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
