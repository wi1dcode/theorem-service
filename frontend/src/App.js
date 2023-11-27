import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useContext, useEffect } from "react"
import UserContext from "./services/userContext"
import jwtdecode from "jwt-decode"

import Home from "./pages/Home"
import Estimation from "./pages/Estimation"
import Dashboard from "./pages/Dashboard"
import Menu from "./pages/Dashboard/Menu"
import Login from "./pages/Login"
import About from "./pages/About"
import Users from "./pages/Dashboard/Users"
import Realisations from "./pages/Realisations"
import Parteneriat from "./pages/Parteneriat"

import Pro from "./pages/Pro"
import ProSavoir from "./pages/Pro/ProSavoir"
import ProClients from "./pages/Pro/ProClients"
import ProWork from "./pages/Pro/ProWork"
import ProContact from "./pages/Pro/ProContact"
import ProMain from "./pages/Pro/ProMain"
import Projects from "./pages/Dashboard/Projects"
import Gallery from "./pages/Gallery"
import EstimationEmbed from "./pages/EstimationEmbed"
import Expertises from "./pages/Expertises"
import Eco from "./pages/Eco"
import Energetique from "./pages/Energetique"

function App() {
  const { token } = useContext(UserContext)

  useEffect(() => {
    if (token) {
      const now = new Date().getTime()
      const expToken = jwtdecode(token).exp * 1000
      if (now > expToken) {
        localStorage.removeItem("token")
      }
    }
  }, [token])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/expertises" element={<Expertises />} />
        <Route path="/realisations" element={<Realisations />} />
        <Route path="/realisations/:id" element={<Gallery />} />
        <Route path="/partenariat" element={<Parteneriat />} />
        <Route path="/eco" element={<Eco />} />
        <Route path="/energetique" element={<Energetique />} />
        <Route path="/estimation" element={<EstimationEmbed />} />
        <Route path="/contact" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="dashboard/*" element={<Dashboard />}>
          <Route index element={<Menu />} />
          <Route path="users" element={<Users />} />
          <Route path="projects" element={<Projects />} />
        </Route>
        <Route path="pro/*" element={<Pro />}>
          <Route index element={<ProMain />} />
          <Route path="savoir-faire" element={<ProSavoir />} />
          <Route path="clients" element={<ProClients />} />
          <Route path="realisations" element={<ProWork />} />
          <Route path="contact" element={<ProContact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
