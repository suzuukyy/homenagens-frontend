import React from 'react';
import logo from '../assets/logo-sf.png';

export default function Header({ usuarioLogado, onLogout }) {
  return (
    <header style={{background:'#e8f9fa', borderBottom:'2px solid #2ab7b7', padding:'12px 0', marginBottom:32}}>
      <div style={{display:'flex', alignItems:'center', maxWidth:1080, margin:'0 auto', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <img src={logo} alt="Logo São Francisco" style={{height:54, width:'auto', borderRadius:8, marginRight:18, objectFit:'contain', background:'#fff', boxShadow:'0 1px 6px #0002'}} />
          <span style={{fontSize:28, color:'#11b1b5', fontWeight:700, letterSpacing:1}}>São Francisco</span>
        </div>
        {usuarioLogado && (
          <button
            style={{
              background:'#e8ffe8',
              color:'#1a8c1a',
              border:'2px solid #2ecc40',
              borderRadius:8,
              padding:'10px 22px',
              fontWeight:700,
              fontSize:16,
              marginRight:16,
              boxShadow:'0 0 8px #2ecc4060',
              display:'flex',
              alignItems:'center',
              gap:8,
              cursor:'default',
              pointerEvents:'none'
            }}
            title="Você está online"
            disabled
          >
            <span style={{
              display:'inline-block',
              width:11,
              height:11,
              borderRadius:'50%',
              background:'#2ecc40',
              marginRight:7,
              boxShadow:'0 0 4px #2ecc40'
            }}></span>
            Usuário Online: <b>{usuarioLogado.nome}</b>
          </button>
        )}
        {onLogout && (
          <button onClick={onLogout} style={{background:'#ff6b6b', color:'#fff', border:'none', borderRadius:6, padding:'10px 22px', fontWeight:700, fontSize:16, cursor:'pointer'}}>Logout</button>
        )}
      </div>
    </header>
  );
}
