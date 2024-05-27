import React, { useState } from 'react';
import axios from 'axios';
import './TelaGit.css'; 
import Header from '../../Header/Header.js';

function TelaGit() {
  const [projeto, setProjeto] = useState('');
  const [branch, setBranch] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('projeto', projeto);
    formData.append('branch', branch);
    formData.append('file', file); // Atualize para 'file'
    
    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar arquivo. Por favor, tente novamente.' + error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log('Nome do arquivo:', selectedFile.name);
    console.log('Tipo do arquivo:', selectedFile.type);
    console.log('Tamanho do arquivo:', selectedFile.size);
  };

  return (
    <div>
      <Header />
      <div className='telagit'>
        <form onSubmit={handleSubmit}>
          <h2>Insira as Informações</h2>
          <div className="input-container">
            <label htmlFor="projeto">Projeto:</label>
            <input
              type="text"
              id="projeto"
              value={projeto}
              onChange={(e) => setProjeto(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>
          <div className="input-container">
            <label htmlFor="branch">Branch:</label>
            <input
              type="text"
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Digite o nome da branch"
            />
          </div>
          <div className="input-container">
            <label htmlFor="arquivo">Anexar:</label>
            <input
              type="file"
              id="arquivo"
              onChange={handleFileChange}
              name="file"
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default TelaGit;
