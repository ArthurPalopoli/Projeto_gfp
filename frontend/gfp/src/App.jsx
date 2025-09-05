import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./pages/Principal";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transacoes from "./pages/Transacoes";
import Contas from "./pages/Contas";
import Categorias from "./pages/Categorias";



import { UsuarioProvider } from "./UsuarioContext";

export default function App() {
  return (
    <UsuarioProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Principal />} />
          

        </Routes>
      </Router>
    </UsuarioProvider>
  );
}
