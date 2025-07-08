import React, { useState } from 'react';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Verifica se já existe usuário salvo no localStorage
  React.useEffect(() => {
    const salvo = localStorage.getItem('usuario_admin');
    if (salvo && onLogin) {
      try {
        const user = JSON.parse(salvo);
        onLogin(user);
      } catch {}
    }
  }, [onLogin]);

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario, senha })
      });
      if (resp.ok) {
        const data = await resp.json();
        // Salva o usuário no localStorage
        localStorage.setItem('usuario_admin', JSON.stringify(data.usuario));
        if (onLogin) onLogin(data.usuario);
      } else {
        setErro('Usuário ou senha inválidos!');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor!');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'60vh'}}>
      <form onSubmit={handleSubmit} style={{background:'#fff',padding:32,borderRadius:12,boxShadow:'0 2px 16px #0002',width:340}}>
        <h2 style={{textAlign:'center',marginBottom:24,color:'#11b1b5'}}>Área Administrativa</h2>
        <div style={{marginBottom:16}}>
          <label style={{fontWeight:600}}>Usuário
            <input type="text" value={usuario} onChange={e=>setUsuario(e.target.value)} required style={{width:'100%',padding:10,marginTop:6,border:'1px solid #b1e1e1',borderRadius:6}} />
          </label>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontWeight:600}}>Senha
            <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required style={{width:'100%',padding:10,marginTop:6,border:'1px solid #b1e1e1',borderRadius:6}} />
          </label>
        </div>
        <button type="submit" disabled={carregando} style={{width:'100%',background:'#11b1b5',color:'#fff',padding:12,border:'none',borderRadius:8,fontWeight:700,fontSize:18,cursor:'pointer'}}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        {erro && <div style={{color:'red',marginTop:16,textAlign:'center'}}>{erro}</div>}
      </form>
    </div>
  );
}

export default Login;
