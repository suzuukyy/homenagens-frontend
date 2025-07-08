import React, { useState } from 'react';

export default function UsuarioForm({ onUsuarioCriado }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('senior');
  const [telefone, setTelefone] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const novo = { nome, email, senha, cargo, telefone };
    try {
      const resp = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
      });
      if (resp.ok) {
        // Login automático após cadastro
        const loginResp = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });
        if (loginResp.ok) {
          window.location.href = '/admin/usuarios';
        } else {
          alert('Usuário criado, mas houve erro ao fazer login automático.');
        }
        if (onUsuarioCriado) onUsuarioCriado();
      } else {
        alert('Erro ao cadastrar usuário!');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor!');
    }
    setNome(''); setEmail(''); setSenha(''); setCargo('admin'); setTelefone('');
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'0 auto',display:'flex',flexDirection:'column',gap:16}}>
      <h3 style={{color:'#1199a7'}}>Novo Usuário</h3>
      <input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
      <input placeholder="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required />
      <select value={cargo} onChange={e=>setCargo(e.target.value)}>
        <option value="Senior">Senior</option>
        <option value="Junior">Junior</option>
        {nome.trim().toLowerCase() === 'suzuky06' && (
          <option value="ADM">ADM</option>
        )}
      </select>
      <input placeholder="Telefone" type="tel" value={telefone} onChange={e=>setTelefone(e.target.value)} required />
      <button style={{background:'#1199a7',color:'#fff',padding:10,border:'none',borderRadius:6,fontWeight:600}}>Criar Usuário</button>
    </form>
  );
}
