import React from 'react';
import { NavLink } from 'react-router-dom';

const menuStyle = {
  background: '#1199a7', color: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', height: 60, boxShadow: '0 2px 8px #0001', zIndex: 2
};
const linkStyle = {
  color: '#fff', textDecoration: 'none', padding: '0 18px', fontWeight: 600, fontSize: 17, height: 60, display: 'flex', alignItems: 'center', borderBottom: '3px solid transparent'
};
const activeStyle = {
  ...linkStyle, borderBottom: '3px solid #fff', background: '#13b1b5', borderRadius: 6
};

export default function AdminMenu({ usuarioLogado }) {
  return (
    <nav style={menuStyle}>
      <div style={{display:'flex',flex:1}}>
        {usuarioLogado && usuarioLogado.cargo !== 'Junior' && (
          <NavLink to="/admin/homenagens" style={({isActive})=>isActive?activeStyle:linkStyle}>Homenagens</NavLink>
        )}
        <NavLink to="/admin/usuarios" style={({isActive})=>isActive?activeStyle:linkStyle}>Usuários</NavLink>
        <NavLink to="/admin/mensagens" style={({isActive})=>isActive?activeStyle:linkStyle}>Mensagens</NavLink>
        {usuarioLogado && usuarioLogado.cargo === 'ADM' && (
          <NavLink to="/admin/logs" style={({isActive})=>isActive?activeStyle:linkStyle}>LOGS</NavLink>
        )}
      </div>
    </nav>
  );
}
