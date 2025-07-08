import React, { useState } from 'react';

function HomenagemForm({ onHomenagemCriada }) {
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [obito, setObito] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const resposta = await fetch('/api/homenagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, nascimento, obito, mensagem })
      });
      if (!resposta.ok) throw new Error('Erro ao criar homenagem');
      const novaHomenagem = await resposta.json();
      setNome(''); setNascimento(''); setObito(''); setMensagem('');
      if (onHomenagemCriada) onHomenagemCriada(novaHomenagem);
    } catch (err) {
      setErro('Erro ao criar homenagem. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'32px auto',background:'#f8f8f8',padding:24,borderRadius:8,boxShadow:'0 2px 8px #0001'}}>
      <h2>Nova Homenagem</h2>
      <div style={{marginBottom:12}}>
        <label>Nome: <input required value={nome} onChange={e=>setNome(e.target.value)} style={{width:'100%'}} /></label>
      </div>
      <div style={{marginBottom:12}}>
        <label>Nascimento: <input type="date" required value={nascimento} onChange={e=>setNascimento(e.target.value)} style={{width:'100%'}} /></label>
      </div>
      <div style={{marginBottom:12}}>
        <label>Óbito: <input type="date" required value={obito} onChange={e=>setObito(e.target.value)} style={{width:'100%'}} /></label>
      </div>
      <div style={{marginBottom:12}}>
        <label>Mensagem: <textarea value={mensagem} onChange={e=>setMensagem(e.target.value)} style={{width:'100%'}} /></label>
      </div>
      <button type="submit" disabled={carregando} style={{background:'#11b1b5',color:'#fff',padding:'10px 24px',border:'none',borderRadius:6,fontWeight:600,fontSize:16,cursor:'pointer'}}>
        {carregando ? 'Salvando...' : 'Criar Homenagem'}
      </button>
      {erro && <div style={{color:'red',marginTop:10}}>{erro}</div>}
    </form>
  );
}

export default HomenagemForm;
