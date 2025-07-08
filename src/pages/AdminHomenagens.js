import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import HomenagemFormNovo from '../components/HomenagemFormNovo';
import AdminMensagens from './AdminMensagens';

export default function AdminHomenagens() {
  const mensagensRef = useRef();
  const [homenagens, setHomenagens] = useState([]);
  const navigate = useNavigate();

  // Função para excluir homenagem
  async function handleExcluirHomenagem(slug) {
    if (!window.confirm('Tem certeza que deseja apagar esta homenagem?')) return;
    // Remove imediatamente da UI
    const homenagensAntes = [...homenagens];
    setHomenagens(homenagens.filter(h => h.slug !== slug));
    try {
      const resp = await fetch(`/api/homenagens/${slug}`, { method: 'DELETE' });
      if (resp.status !== 204 && resp.status !== 200) {
        // Reverte caso falhe
        setHomenagens(homenagensAntes);
        console.error('Erro ao apagar homenagem. Status:', resp.status);
      } else {
        // Atualizar mensagens do admin automaticamente
        if (mensagensRef.current && typeof mensagensRef.current.fetchMensagens === 'function') {
          mensagensRef.current.fetchMensagens();
        }
      }
    } catch (e) {
      setHomenagens(homenagensAntes);
      console.error('Erro de conexão com o servidor ao apagar homenagem:', e);
    }
  }

  // Carregar homenagens do backend ao abrir a página
  useEffect(() => {
    fetch('/api/homenagens')
      .then(res => res.json())
      .then(data => setHomenagens(data));
  }, []);

  async function handleHomenagemCriada() {
    // Após criar, buscar novamente do backend para garantir sincronização
    const res = await fetch('/api/homenagens');
    const data = await res.json();
    setHomenagens(data);
  }

  return (
    <Routes>
      <Route path="/" element={
        <div style={{padding:32}}>
          <h2 style={{color:'#1199a7'}}>Homenagens</h2>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
            <button onClick={() => navigate('/admin/homenagens/novo')} style={{background:'#f6f6f6',color:'#1199a7',padding:'6px 18px',border:'1px solid #c4e0e7',borderRadius:6,fontWeight:500,fontSize:15,cursor:'pointer',boxShadow:'none',transition:'all .2s'}}>
              Criar Homenagem
            </button>
          </div>
          <div style={{margin:'32px 0', background:'#fff', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001'}}>
            <h3 style={{color:'#1199a7'}}>Homenagens Cadastradas</h3>
        <div style={{marginTop: 24}}>
          {homenagens.length === 0 && (
            <div style={{textAlign:'center',color:'#888',padding:32}}>Nenhuma homenagem cadastrada ainda.</div>
          )}
          {homenagens.map((h, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',background:'#fafbfc',borderRadius:12,boxShadow:'0 2px 8px #0001',padding:'18px 32px',marginBottom:24}}>
              <div style={{width:110, height:110, borderRadius:'50%',overflow:'hidden',border:'4px solid #e3e3e3',flexShrink:0,background:'#fff'}}>
                {h.foto ? (
                  <img src={h.foto} alt={h.nome} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                ) : (
                  <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,color:'#bbb'}}>?</div>
                )}
              </div>
              <div style={{marginLeft:32,flex:1}}>
                <div style={{fontSize:18,fontWeight:700,letterSpacing:1.2,color:'#2a3950',marginBottom:4,textTransform:'uppercase'}}>{h.nome}</div>
                <div style={{fontSize:15,color:'#1199a7',marginBottom:8}}>
                  {h.nascimento && <span><b>Nascimento:</b> {h.nascimento}</span>}
                  {h.nascimento && h.obito && <span style={{margin:'0 8px'}}>|</span>}
                  {h.obito && <span><b>Óbito:</b> {h.obito}</span>}
                </div>
                {h.mensagem && <div style={{fontSize:14,color:'#444',marginBottom:8}}><b>Mensagem:</b> {h.mensagem}</div>}
                <div style={{marginTop:10}}>
                  {h.slug && (
                    <>
                      <button onClick={()=>window.open(`/homenagens/${h.slug}.html`, '_blank')} style={{background:'#11b1b5',color:'#fff',padding:'8px 32px',border:'none',borderRadius:6,fontWeight:700,fontSize:15,cursor:'pointer',marginRight:16}}>Visualizar</button>
                      <button onClick={()=>handleExcluirHomenagem(h.slug)} style={{background:'#e74c3c',color:'#fff',padding:'8px 18px',border:'none',borderRadius:6,fontWeight:700,fontSize:15,cursor:'pointer'}}>Apagar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      } />
      <Route path="/novo" element={
        <div style={{padding:32}}>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
            <button onClick={() => navigate('/admin/homenagens')} style={{background:'#f6f6f6',color:'#1199a7',padding:'6px 18px',border:'1px solid #c4e0e7',borderRadius:6,fontWeight:500,fontSize:15,cursor:'pointer',boxShadow:'none',transition:'all .2s'}}>
              Voltar
            </button>
          </div>
          <div style={{margin:'32px 0', background:'#f9f9f9', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001', maxWidth:900, marginLeft:'auto',marginRight:'auto'}}>
            <HomenagemFormNovo onHomenagemCriada={handleHomenagemCriada} />
          </div>
        </div>
      } />
    </Routes>
  );
}
