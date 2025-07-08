import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';

// Função utilitária para recortar imagem base64
async function getCroppedImg(imageSrc, crop, zoom, aspect = 1) {
  const createImage = url => new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const scale = image.naturalWidth / image.width;
  const cropX = crop.x * scale;
  const cropY = crop.y * scale;
  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scale,
    crop.height * scale,
    0,
    0,
    crop.width,
    crop.height
  );
  return canvas.toDataURL('image/jpeg');
}


export default function HomenagemFormNovo({ onHomenagemCriada }) {
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [obito, setObito] = useState('');
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef();
  const [showCrop, setShowCrop] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPreviewUrl(reader.result);
        setShowCrop(true);
      });
      reader.readAsDataURL(e.target.files[0]);
      setFoto(e.target.files[0]);
    }
  }

  function onCropComplete(_, croppedAreaPixels) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    let fotoFinal = previewUrl;
    if (previewUrl && croppedAreaPixels) {
      fotoFinal = await getCroppedImg(previewUrl, croppedAreaPixels, zoom, 1);
    }
    try {
      const resposta = await fetch('/api/homenagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, nascimento, obito, foto: fotoFinal })
      });
      if (!resposta.ok) throw new Error('Erro ao criar homenagem');
      const novaHomenagem = await resposta.json();
      setNome(''); setNascimento(''); setObito(''); setFoto(null); setPreviewUrl(null); setShowCrop(false); setZoom(1); setCroppedAreaPixels(null);
      if (onHomenagemCriada) onHomenagemCriada(novaHomenagem);
    } catch (err) {
      setErro('Erro ao criar homenagem. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{background:'#fff',padding:20,borderRadius:8,boxShadow:'0 2px 8px #0001',maxWidth:900,margin:'32px auto'}}>
      <div style={{display:'flex',gap:24,alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <label style={{fontWeight:600}}>Nome</label>
          <input required value={nome} onChange={e=>setNome(e.target.value)} style={{width:'100%',marginBottom:16}} placeholder="Nome" />
          <label style={{fontWeight:600}}>Data de nascimento</label>
          <input required type="date" value={nascimento} onChange={e=>setNascimento(e.target.value)} style={{width:'100%',marginBottom:16}} />
          <label style={{fontWeight:600}}>Data Óbito</label>
          <input required type="date" value={obito} onChange={e=>setObito(e.target.value)} style={{width:'100%',marginBottom:16}} />
        </div>
        <div style={{flex:1,background:'#fafafa',borderRadius:8,padding:16,boxShadow:'0 1px 4px #0001'}}>
          <div style={{marginBottom:8,fontWeight:600}}>Enviar e cortar foto</div>
          <div style={{display:'flex',gap:24}}>
            <div style={{width:220, height:220, background:'#8883',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              {showCrop && previewUrl ? (
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{containerStyle:{borderRadius:'50%'}}}
                />
              ) : (
                <div style={{width:180,height:180,borderRadius:'50%',background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #999'}}>SEM FOTO</div>
              )}
            </div>
            <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={onSelectFile} style={{marginBottom:12}} />
              <button type="button" onClick={()=>setShowCrop(true)} style={{background:'#11b1b5',color:'#fff',padding:'8px 14px',border:'none',borderRadius:6,fontWeight:600,marginBottom:12}}>RECORTAR E VISUALIZAR A FOTO</button>
              <div style={{margin:'8px 0'}}>Zoom:</div>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e=>setZoom(Number(e.target.value))} style={{width:120}} />
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:32,display:'flex',justifyContent:'flex-end'}}>
        <button type="submit" disabled={carregando} style={{background:'#43c36a',color:'#fff',padding:'12px 36px',border:'none',borderRadius:6,fontWeight:700,fontSize:17,cursor:'pointer'}}>
          Salvar
        </button>
      </div>
      {erro && <div style={{color:'red',marginTop:10}}>{erro}</div>}
    </form>
  );
}
