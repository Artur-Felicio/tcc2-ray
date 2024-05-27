const express = require('express');
const multer = require('multer');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

const app = express();
app.use(cors());

const git = simpleGit({
  baseDir: __dirname,
  binary: 'git',
  maxConcurrentProcesses: 1,
  config: ['core.quotepath=off']
});

// Configuração do multer para armazenar arquivos no disco
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  const projeto = req.body.projeto;
  const branch = req.body.branch || 'main';
  const file = req.file;

  if (!projeto || !branch || !file) {
    return res.status(400).send('Campos obrigatórios faltando.');
  }

  const fileName = file.originalname;
  const newPath = path.join(__dirname, 'uploads', fileName);

  console.log('Arquivo recebido:', fileName);

  try {
    await git.raw(['merge', '--abort']).catch(err => {
      console.log('Nenhuma operação de merge pendente para abortar.');
    });

    const branches = await git.branchLocal();
    if (!branches.all.includes(branch)) {
      await git.checkoutLocalBranch(branch);
    } else {
      await git.checkout(branch);
    }

    await git.fetch('origin', branch);
    await git.reset(['--hard', `origin/${branch}`]);
    await git.clean('n', ['-d']);

    // Regravar o arquivo no diretório uploads para garantir a versão correta
    fs.writeFileSync(newPath, file.buffer);

    // Configurar usuário e e-mail globalmente para o repositório
    await git.addConfig('user.name', process.env.GIT_USERNAME, true, 'global');
    await git.addConfig('user.email', process.env.GIT_EMAIL, true, 'global');

    await git.add('./uploads/*', { '--force': null });
    await git.commit(`Adicionado/Atualizado arquivo ${fileName}`, { '--allow-empty': null });

    console.log('Arquivo commitado com sucesso.');

    const username = encodeURIComponent(process.env.GIT_USERNAME);
    const token = encodeURIComponent(process.env.GIT_TOKEN);
    const remoteUrl = `https://${username}:${token}@github.com/Artur-Felicio/teste`;
    const remotes = await git.getRemotes();
    if (!remotes.find(remote => remote.name === 'origin')) {
      await git.addRemote('origin', remoteUrl);
    } else {
      await git.remote(['set-url', 'origin', remoteUrl]);
    }

    await git.push('origin', branch);

    console.log('Arquivo enviado e push realizado com sucesso.');
    res.status(200).send('Arquivo enviado e push realizado com sucesso.');
  } catch (error) {
    console.error('Erro ao realizar operações Git:', error);
    res.status(500).send('Erro ao realizar operações Git.');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
