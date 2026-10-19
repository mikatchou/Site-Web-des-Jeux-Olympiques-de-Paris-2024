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
import NewPassword from "./pages/NewPassword";
import Result from "./pages/Result";
import EventDetails from "./pages/EventDetails";

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
            <Route path="/connexion/mot-de-passe-oublie" element={<NewPassword />} />
            <Route path="/deconnexion" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/recherche" element={<Result />} />  
            <Route path="/recherche/billet/:id" element={<EventDetails />} />  
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
