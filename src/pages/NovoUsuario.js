import React from 'react';
import UsuarioForm from '../components/UsuarioForm';
import { useNavigate } from 'react-router-dom';

export default function NovoUsuario() {
  const navigate = useNavigate();
  function handleCriado() {
    navigate('/admin/usuarios');
  }
  return (
    <div style={{minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{padding:32, background:'#fff', borderRadius:10, boxShadow:'0 2px 16px #0001', minWidth:340}}>
        <h2 style={{color:'#1199a7', marginBottom:24, textAlign:'center'}}>Novo Usuário</h2>
        <UsuarioForm onUsuarioCriado={handleCriado} />
        <button onClick={()=>navigate('/admin/usuarios')} style={{marginTop:24, background:'#eee', color:'#1199a7', border:'none', borderRadius:6, padding:'10px 18px', fontWeight:600, fontSize:16, cursor:'pointer', width:'100%'}}>Voltar</button>
      </div>
    </div>
  );
}
