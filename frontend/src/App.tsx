import "./styles/variables.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./components/MainLayout"
import Home from "./pages/Home"

function App() {

  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
