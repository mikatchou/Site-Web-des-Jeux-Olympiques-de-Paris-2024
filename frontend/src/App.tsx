import "./styles/variables.css";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Home from "./pages/Home"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound";
import Registered from "./pages/Registered";
import Activation from "./pages/Activation";

function Logout (){
  localStorage.clear()
  return <Navigate to="/" />
}

function RegisterAndLogout () {
  localStorage.clear()
  return <Register />
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
            <Route path="/Déconnexion" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
