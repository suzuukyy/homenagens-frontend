import React, { useEffect, useState } from 'react';

function ListaHomenagens() {
  const [homenagens, setHomenagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchHomenagens() {
      setCarregando(true);
      setErro('');
      try {
        const resposta = await fetch('/api/homenagens');
        if (!resposta.ok) throw new Error('Erro ao buscar homenagens');
        const dados = await resposta.json();
        setHomenagens(dados);
      } catch (err) {
        setErro('Erro ao buscar homenagens.');
      } finally {
        setCarregando(false);
      }
    }
    fetchHomenagens();
  }, []);

  if (carregando) return <div style={{margin:'32px auto',textAlign:'center'}}>Carregando homenagens...</div>;
  if (erro) return <div style={{margin:'32px auto',color:'red',textAlign:'center'}}>{erro}</div>;
  if (!homenagens.length) return <div style={{margin:'32px auto',textAlign:'center'}}>Nenhuma homenagem cadastrada ainda.</div>;

  return (
    <div style={{maxWidth:600,margin:'32px auto'}}>
      <h2>Homenagens cadastradas</h2>
      <ul style={{listStyle:'none',padding:0}}>
        {homenagens.map((h,i) => (
          <li key={i} style={{background:'#f2f2f2',marginBottom:16,padding:16,borderRadius:8,boxShadow:'0 1px 4px #0001'}}>
            <strong>Nome:</strong> {h.nome}<br/>
            <strong>Nascimento:</strong> {h.nascimento}<br/>
            <strong>Óbito:</strong> {h.obito}<br/>
            {h.foto && (
              <div style={{margin:'10px 0'}}>
                <img src={h.foto} alt={h.nome} style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'2px solid #ccc'}} />
              </div>
            )}
            <button
              style={{margin:'8px 0 0 0',padding:'8px 18px',background:'#11b1b5',color:'#fff',border:'none',borderRadius:5,fontWeight:600,cursor:'pointer'}}
              onClick={() => window.open(`/homenagens/${h.slug}.html`, '_blank')}
              disabled={!h.slug}
            >Visualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaHomenagens;
