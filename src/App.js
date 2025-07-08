import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import AdminMenu from './components/AdminMenu';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHomenagens from './pages/AdminHomenagens';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminMensagens from './pages/AdminMensagens';
import NovoUsuario from './pages/NovoUsuario';
import AdminLogs from './pages/AdminLogs';

import Login from './components/Login';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} />;
  }

  return (
    <Router>
      <div className="App">
        <Header usuarioLogado={usuarioLogado} onLogout={() => {
  localStorage.removeItem('usuario_admin');
  setUsuarioLogado(null);
  window.location.href = '/admin/login';
}} />
        <AdminMenu usuarioLogado={usuarioLogado} />
        <Routes>
          <Route path="/admin/homenagens/*" element={usuarioLogado && usuarioLogado.cargo === 'Junior' ? <Navigate to="/admin/mensagens" /> : <AdminHomenagens />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios usuarioLogado={usuarioLogado} />} />
          <Route path="/admin/usuarios/novo" element={<NovoUsuario />} />
          <Route path="/admin/mensagens" element={<AdminMensagens />} />
          <Route path="/admin/logs" element={usuarioLogado && usuarioLogado.cargo === 'ADM' ? <AdminLogs /> : <Navigate to="/admin/homenagens" />} />
          <Route path="*" element={<Navigate to="/admin/homenagens" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
