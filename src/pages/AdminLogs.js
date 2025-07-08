import React, { useEffect, useState } from 'react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/logs')
      .then(res => res.json())
      .then(data => { setLogs(data); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  return (
    <div style={{padding:32}}>
      <h2 style={{color:'#1199a7'}}>Logs do Sistema</h2>
      {logs.length > 0 && !carregando && (
        <button
          onClick={() => {
            if(window.confirm('Tem certeza que deseja limpar todos os logs?')) {
              fetch('http://localhost:5001/api/logs', { method: 'DELETE' })
                .then(res => res.json())
                .then(() => setLogs([]));
            }
          }}
          style={{marginBottom:16, background:'#e53935', color:'#fff', border:'none', borderRadius:4, padding:'8px 18px', cursor:'pointer', fontWeight:600, fontSize:15, boxShadow:'0 2px 8px #0002'}}>
          Limpar Logs
        </button>
      )}
      <div style={{margin:'32px 0', background:'#f9f9f9', borderRadius:8, padding:24, boxShadow:'0 2px 12px #0001', minHeight:120}}>
        {carregando ? (
        <p>Carregando logs...</p>
      ) : logs.length === 0 ? (
        <p>Nenhum log registrado ainda.</p>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#e0f7fa' }}>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Data/Hora</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Ação</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Usuário</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Detalhes</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>IP</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Endpoint</th>
                <th style={{padding: '6px', border: '1px solid #b2ebf2'}}>Método</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                typeof log === 'object' && log !== null ? (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : '#f1f8e9' }}>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.dataHora || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.acao || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.usuario || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.detalhes || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.ip || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.endpoint || '-'}</td>
                    <td style={{padding: '6px', border: '1px solid #b2ebf2'}}>{log.metodo || '-'}</td>
                  </tr>
                ) : (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : '#f1f8e9' }}>
                    <td colSpan={7} style={{padding: '6px', border: '1px solid #b2ebf2', color: '#888'}}>{log}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
