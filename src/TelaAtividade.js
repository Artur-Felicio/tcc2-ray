import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import './TelaAtividade.css'; 
import Header from './Header/Header.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TelaAtividade = () => {
    const [motivo, setMotivo] = useState('');
    const [dataTermino, setDataTermino] = useState('');
    const [nomeAnalista, setNomeAnalista] = useState('');
    const [descricao, setDescricao] = useState('');
    const [status, setStatus] = useState(''); // Novo estado para o status

    useEffect(() => {
        console.log("Referência do Firestore:", db);
    }, [db]);

    const salvarDadosNoFirestore = async () => {
        if (!db) {
            console.error("Referência do Firestore não está definida!");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'atividades'), {
                motivo: motivo,
                dataTermino: new Date(dataTermino), // Convertendo para um objeto de data
                nomeAnalista: nomeAnalista,
                descricao: descricao,
                status: status // Adicionando o status ao documento
            });
            console.log("Documento criado com ID: ", docRef.id);
            limparCampos(); // Limpa os campos após salvar os dados
        } catch (error) {
            console.error("Erro ao salvar os dados: ", error);
        }
    };

    const limparCampos = () => {
        setMotivo('');
        setDataTermino('');
        setNomeAnalista('');
        setDescricao('');
        setStatus(''); // Limpar o status também
    };

    return (
        <div>
            <Header />
            <div className="tela-atividade">
                <body className='bodyy'>
                <h2>Nova Atividade</h2>
                <div>
                    <label>Motivo:</label>
                    <input
                        type="text"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                </div>
                <div>
                    <label>Data de Término:</label>
                    <input
                        type="date"
                        value={dataTermino}
                        onChange={(e) => setDataTermino(e.target.value)}
                    />
                </div>
                <div>
                    <label>Nome do Analista:</label>
                    <input
                        type="text"
                        value={nomeAnalista}
                        onChange={(e) => setNomeAnalista(e.target.value)}
                    />
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </div>
                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Selecione o status</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Aberto">Aberto</option>
                        <option value="Pendente">Pendente</option>
                    </select>
                </div>
                <div>
                    <button onClick={limparCampos}>Limpar</button> 
                    <button onClick={salvarDadosNoFirestore}>Salvar</button>
                </div>
                </body>
            </div>
        </div>
    );
}

export default TelaAtividade;
