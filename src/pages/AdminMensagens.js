import React, { useEffect, useState } from 'react';

// Estilo para mostrar botão só no hover
const estiloBtnApagar = `
.btn-apagar-msg { opacity:0.18 !important; }
.msg-card-admin:hover .btn-apagar-msg { opacity:0.85 !important; }
.btn-apagar-msg:hover { color: #e74c3c !important; opacity:1 !important; }
`;

export default function AdminMensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [homenagens, setHomenagens] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar homenagens (para pegar fotos)
  async function fetchHomenagens() {
    try {
      const res = await fetch('/api/homenagens');
      const data = await res.json();
      setHomenagens(data);
    } catch {}
  }

  // Função para buscar mensagens
  async function fetchMensagens() {
    setCarregando(true);
    try {
      const res = await fetch('/api/mensagens');
      const data = await res.json();
      setMensagens(data);
    } catch {
      // erro silencioso
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchHomenagens();
    fetchMensagens();
  }, []);

  // Busca foto da homenagem pela slug
  function getFotoHomenagem(slug) {
    const h = homenagens.find(h => h.slug === slug);
    return h && h.foto ? h.foto : null;
  }

  // DICA: após deletar uma homenagem no AdminHomenagens,
  // chame fetchMensagens() deste componente para atualizar a lista automaticamente.


  return (
    <div style={{padding:32}}>
      <style>{estiloBtnApagar}</style>
      <h2 style={{color:'#1199a7'}}>Mensagens</h2>
      <div style={{margin:'32px 0', background:'#f9f9f9', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001', minHeight:120}}>
        {carregando ? <p>Carregando...</p> : mensagens.length === 0 ? <p>Nenhuma mensagem recebida ainda.</p> :
          // Agrupar mensagens por homenagem (slug)
          Object.entries(
            mensagens.reduce((acc, m) => {
              if (!acc[m.slug]) acc[m.slug] = [];
              acc[m.slug].push(m);
              return acc;
            }, {})
          ).map(([slug, msgs]) => {
            const homenagem = homenagens.find(h => h.slug === slug);
            const foto = homenagem && homenagem.foto ? homenagem.foto : null;
            const nome = homenagem && homenagem.nome ? homenagem.nome : slug;
            return (
              <div key={slug} style={{marginBottom:32, background:'#eaf7fa', borderRadius:14, boxShadow:'0 2px 10px #0001', padding:'18px 24px'}}>
                <div style={{display:'flex',alignItems:'center',marginBottom:18}}>
                  <div style={{width:64, height:64, borderRadius:'50%',overflow:'hidden',border:'3px solid #c1e2e6',background:'#fff',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',marginRight:20}}>
                    {foto ? (
                      <img src={foto} alt={nome} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    ) : (
                      <span style={{fontSize:32,color:'#bbb'}}>?</span>
                    )}
                  </div>
                  <div style={{fontWeight:700,fontSize:20,color:'#1199a7',textTransform:'uppercase',letterSpacing:1.1}}>{nome}</div>
                  <div style={{marginLeft:18, color:'#888', fontSize:15}}><b>Slug:</b> {slug}</div>
                </div>
                {/* Lista de mensagens dessa homenagem */}
                {msgs.map((m, i) => (
                  <div key={i} className="msg-card-admin" style={{display:'flex',alignItems:'flex-start',background:'#f8fafc',borderRadius:10,padding:'16px 20px',marginBottom:16,border:'1px solid #d6e3e9',boxShadow:'0 1px 4px #0001',position:'relative',gap:18}}>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',marginBottom:4}}>
                        <span style={{fontWeight:700,fontSize:16,color:'#185c5e',marginRight:10}}>{m.nome}</span>
                        <span style={{marginLeft:'auto',color:'#4b6c7a',fontSize:13}}>{m.dataHora||''}</span>
                      </div>
                      <div style={{color:'#333',whiteSpace:'pre-line',fontSize:'1.07em',marginBottom:2}}>{m.mensagem}</div>
                      <div style={{color:'#888',fontSize:13,marginTop:6,display:'flex',alignItems:'center',gap:14}}>
                        <span><b>Remetente:</b> {m.email}</span>
                        {m.telefone && <span><b>Telefone:</b> {m.telefone}</span>}
                      </div>
                    </div>
                    <button
                      onClick={async()=>{
                        const msgId = m.id !== undefined && m.id !== null ? m.id : (m._id !== undefined && m._id !== null ? m._id : m.idx);
                        if(msgId === undefined || msgId === null){
                          alert('Mensagem sem id válido!');
                          return;
                        }
                        if(window.confirm('Tem certeza que deseja apagar esta mensagem?')){
                          const resp = await fetch(`/api/mensagens/${m.slug}/${msgId}`, {method:'DELETE'});
                          if(resp.status === 204) {
                            setMensagens(msgsAntigas=>msgsAntigas.filter(msg=>!(msg.slug===m.slug && (msg.id||msg._id||msg.idx)===msgId)));
                          } else {
                            alert('Erro ao apagar mensagem.');
                          }
                        }
                      }}
                      title="Apagar mensagem"
                      style={{
                        position:'absolute',
                        top:14,
                        right:14,
                        background:'none',
                        border:'none',
                        color:'#e74c3c',
                        fontSize:20,
                        opacity:0.18,
                        cursor:'pointer',
                        transition:'opacity 0.2s',
                        zIndex:2
                      }}
                      className="btn-apagar-msg"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 8V14M10 8V14M12.5 8V14M4.5 5.5H15.5M16 5.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V5.5M8.5 5.5V4.5C8.5 3.94772 8.94772 3.5 9.5 3.5H10.5C11.0523 3.5 11.5 3.94772 11.5 4.5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}
