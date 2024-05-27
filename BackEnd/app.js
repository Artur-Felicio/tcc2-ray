const express = require('express');
const multer = require('multer'); // Para lidar com o upload de arquivos
const simpleGit = require('simple-git'); // Para operações Git
const fs = require('fs'); // Para manipulação de arquivos
const path = require('path');

const app = express();
const git = simpleGit(); // Instância do SimpleGit

// Configuração do multer para armazenar os arquivos enviados temporariamente no servidor
const upload = multer({ dest: 'uploads/' });

// Rota para lidar com o upload de arquivos
app.post('/upload', upload.single('file'), async (req, res) => {
  const projeto = req.body.projeto;
  const branch = req.body.branch;
  const file = req.file;

  // Mova o arquivo enviado para o diretório desejado
  const oldPath = file.path;
  const newPath = path.join(__dirname, 'uploads', file.originalname);

  fs.rename(oldPath, newPath, async (err) => {
    if (err) {
      console.error('Erro ao mover o arquivo:', err);
      return res.status(500).send('Erro ao mover o arquivo.');
    }

    console.log('Arquivo movido com sucesso para:', newPath);

    try {
      // Adicione e faça o commit do arquivo com o SimpleGit
      await git.add(newPath);
      await git.commit(`Adicionado arquivo ${file.originalname}`);

      console.log('Arquivo commitado com sucesso.');

      // Faça o push para o repositório remoto
      await git.addRemote('origin', 'https://github.com/PatrickOlintoDuarte/Teste.git'); // Adicione a URL do repositório
      await git.push('origin', branch);

      console.log('Arquivo enviado e push realizado com sucesso.');
      res.status(200).send('Arquivo enviado e push realizado com sucesso.');
    } catch (error) {
      console.error('Erro ao realizar operações Git:', error);
      res.status(500).send('Erro ao realizar operações Git.');
    }
  });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
