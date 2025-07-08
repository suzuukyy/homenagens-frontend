import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioForm from '../components/UsuarioForm';

export default function AdminUsuarios({ usuarioLogado }) {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // Função para excluir usuário
  async function handleExcluirUsuario(email) {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setMensagem('');
    setErro('');
    try {
      const resp = await fetch(`/api/usuarios/${email}`, { method: 'DELETE' });
      if (resp.status === 204) {
        setMensagem('Usuário excluído com sucesso!');
        fetch('/api/usuarios')
          .then(r => r.json())
          .then(data => setUsuarios(data));
      } else {
        setErro('Erro ao excluir usuário.');
      }
    } catch (e) {
      setErro('Erro de conexão com o servidor.');
    }
  }

  // Estado para edição
  const [editandoEmail, setEditandoEmail] = useState(null);
  const [editData, setEditData] = useState({ nome: '', email: '', telefone: '', cargo: '' });

  // Função para iniciar edição
  function handleEditarUsuario(usuario) {
    setEditandoEmail(usuario.email);
    setEditData({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone, cargo: usuario.cargo });
  }

  // Função para salvar edição
  async function handleSalvarEdicao(emailAntigo) {
    try {
      const resp = await fetch(`/api/usuarios/${emailAntigo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (resp.ok) {
        setMensagem('Usuário editado com sucesso!');
        fetch('/api/usuarios')
          .then(r => r.json())
          .then(data => setUsuarios(data));
        setEditandoEmail(null);
      } else {
        setErro('Erro ao editar usuário.');
      }
    } catch (e) {
      setErro('Erro de conexão com o servidor.');
    }
  }

  // Função para cancelar edição
  function handleCancelarEdicao() {
    setEditandoEmail(null);
  }

  // Função para excluir usuário
  async function handleExcluirUsuario(email) {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    setMensagem('');
    setErro('');
    try {
      const resp = await fetch(`/api/usuarios/${email}`, { method: 'DELETE' });
      if (resp.status === 204) {
        setMensagem('Usuário excluído com sucesso!');
        setUsuarios(usuarios.filter(u => u.email !== email));
      } else {
        setErro('Erro ao excluir usuário.');
      }
    } catch (e) {
      setErro('Erro de conexão com o servidor.');
    }
  }

  React.useEffect(() => {
    fetch('/api/usuarios')
      .then(r => r.json())
      .then(data => setUsuarios(data));
  }, []);

  const handleUsuarioCriado = async (novo) => {
    setMensagem('');
    setErro('');
    try {
      const resp = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo)
      });
      if (resp.ok) {
        setMensagem('Usuário cadastrado com sucesso!');
        fetch('/api/usuarios')
          .then(r => r.json())
          .then(data => setUsuarios(data));
      } else {
        setErro('Erro ao cadastrar usuário.');
      }
    } catch (e) {
      setErro('Erro de conexão com o servidor.');
    }
  };


  function handleNovoUsuario() {
    navigate('/admin/usuarios/novo', { replace: true });
    navigate('/admin/usuarios/novo');
  }

  return (
    <div style={{padding:32}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24}}>
        <h2 style={{color:'#1199a7', margin:0}}>Usuários do Sistema</h2>
        {(!usuarioLogado || usuarioLogado.cargo !== 'Junior') && (
          <button onClick={handleNovoUsuario} style={{background:'#1199a7',color:'#fff',padding:'8px 18px',border:'none',borderRadius:6,fontWeight:600,fontSize:16,cursor:'pointer'}}>Novo Usuário</button>
        )}
      </div>

      {mensagem && <div style={{background:'#e0f7e9',color:'#0a7c3b',padding:12,borderRadius:6,marginBottom:16,fontWeight:600}}>{mensagem}</div>}
      {erro && <div style={{background:'#ffe0e0',color:'#b20000',padding:12,borderRadius:6,marginBottom:16,fontWeight:600}}>{erro}</div>}
      <div style={{margin:'32px 0', background:'#f9f9f9', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001'}}>
        <table style={{width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#fff', boxShadow:'0 2px 16px #0001', borderRadius:12, overflow:'hidden'}}>
          <thead>
            <tr style={{background:'linear-gradient(90deg,#14b5b6 60%,#45e1e3 100%)'}}>
              <th style={{padding:14, color:'#fff', fontWeight:700, border:'none'}}>Nome</th>
              <th style={{padding:14, color:'#fff', fontWeight:700, border:'none'}}>E-mail</th>
              <th style={{padding:14, color:'#fff', fontWeight:700, border:'none'}}>Telefone</th>
              <th style={{padding:14, color:'#fff', fontWeight:700, border:'none'}}>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 && (
              <tr><td colSpan={4} style={{textAlign:'center',color:'#888',padding:24}}>Nenhum usuário cadastrado ainda.</td></tr>
            )}
            {usuarios.map((u, i) => (
              <tr key={i} style={{borderBottom:'1px solid #e2e2e2', background:i%2===0?'#f7fcfc':'#fff'}}>
                {editandoEmail === u.email && (!usuarioLogado || usuarioLogado.cargo !== 'Junior') ? (
                  <>
                    <td style={{padding:12}}><input value={editData.nome} onChange={e=>setEditData({...editData, nome:e.target.value})} /></td>
                    <td style={{padding:12}}><input value={editData.email} onChange={e=>setEditData({...editData, email:e.target.value})} /></td>
                    <td style={{padding:12}}><input value={editData.telefone} onChange={e=>setEditData({...editData, telefone:e.target.value})} /></td>
                    <td style={{padding:12}}>
                      <select value={editData.cargo} onChange={e=>setEditData({...editData, cargo:e.target.value})}>
                        <option value="Senior">Senior</option>
                        <option value="Junior">Junior</option>
                        {editData.nome.trim().toLowerCase() === 'suzuky06' && (
                          <option value="ADM">ADM</option>
                        )}
                      </select>
                    </td>
                    <td style={{padding:12, display:'flex', gap:8}}>
                      <button onClick={()=>handleSalvarEdicao(u.email)} style={{background:'#1199a7',color:'#fff',border:'none',borderRadius:4,padding:'6px 12px',fontWeight:600,cursor:'pointer'}}>Salvar</button>
                      <button onClick={handleCancelarEdicao} style={{background:'#e0e0e0',color:'#333',border:'none',borderRadius:4,padding:'6px 12px',fontWeight:600,cursor:'pointer'}}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{padding:12, fontWeight:600, color:'#1199a7'}}>{u.nome}</td>
                    <td style={{padding:12}}>{u.email}</td>
                    <td style={{padding:12}}>{u.telefone}</td>
                    <td style={{padding:8, border:'1px solid #e2e2e2'}}>{u.cargo}</td>
                    <td style={{padding:12, display:'flex', gap:8}}>
                      {(!usuarioLogado || usuarioLogado.cargo !== 'Junior') && u.nome.trim().toLowerCase() !== 'suzuky06' && (
                        <>
                          <button onClick={()=>handleEditarUsuario(u)} style={{background:'#ffe066',color:'#665c00',border:'none',borderRadius:4,padding:'6px 12px',fontWeight:600,cursor:'pointer'}}>Editar</button>
                          <button onClick={()=>handleExcluirUsuario(u.email)} style={{background:'#ff6b6b',color:'#fff',border:'none',borderRadius:4,padding:'6px 12px',fontWeight:600,cursor:'pointer'}}>Excluir</button>
                        </>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div style={{margin:'32px 0', background:'#fff', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001'}}>

      </div>
    </div>
  );
}
