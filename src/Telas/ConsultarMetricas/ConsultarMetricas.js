import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';
import './ConsultarMetricas.css'; 
import Header from '../../Header/Header.js';

const db = getFirestore();

const ConsultarMetricas = () => {
    const [nomeAnalistaConsulta, setNomeAnalistaConsulta] = useState('');
    const [resultadosConsulta, setResultadosConsulta] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [novoStatusSelecionado, setNovoStatusSelecionado] = useState(''); // Novo estado para armazenar o novo status selecionado

    const consultarDados = async () => {
        try {
            const q = query(collection(db, 'atividades'), where('nomeAnalista', '==', nomeAnalistaConsulta));
            const querySnapshot = await getDocs(q);
            const dados = [];
            querySnapshot.forEach((doc) => {
                dados.push({ id: doc.id, ...doc.data() });
            });
            setResultadosConsulta(dados);
            setMostrarResultados(true); // Mostrar resultados quando a consulta for realizada com sucesso
        } catch (error) {
            console.error("Erro ao consultar os dados: ", error);
        }
    };

    const alterarStatus = async (itemId) => {
        try {
            const atividadeRef = doc(db, 'atividades', itemId);
            await updateDoc(atividadeRef, { status: novoStatusSelecionado }); // Atualiza o status com o novo status selecionado
            console.log("Status atualizado com sucesso!");
            // Atualizar a lista de dados após a alteração do status
            const novosDados = resultadosConsulta.map(item => {
                if (item.id === itemId) {
                    return { ...item, status: novoStatusSelecionado };
                } else {
                    return item;
                }
            });
            setResultadosConsulta(novosDados);
        } catch (error) {
            console.error("Erro ao atualizar o status: ", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="tela-consulta">
                <body className='bodyy'>
                    <h2>Consulta de Atividades</h2>
                    <div>
                        <label>Nome do Analista:</label>
                        <input
                            type="text"
                            value={nomeAnalistaConsulta}
                            onChange={(e) => setNomeAnalistaConsulta(e.target.value)}
                        />
                        <button className="consultar-btn" onClick={consultarDados}>Consultar</button>
                    </div>
                    {mostrarResultados && (
                        <div className="resultado-consulta">
                            {resultadosConsulta.length > 0 ? (
                                resultadosConsulta.map((resultado, index) => (
                                    <div key={index} className="resultado-separado">
                                        <h3>Resultados para {resultado.nomeAnalista}</h3>
                                        <ul>
                                            <li key={resultado.id}>
                                                <p>Motivo: {resultado.motivo}</p>
                                                <p>Data de Término: {resultado.dataTermino.toDate().toLocaleDateString()}</p>
                                                <p>Nome do Analista: {resultado.nomeAnalista}</p>
                                                <p>Descrição: {resultado.descricao}</p>
                                                <p>Status: {resultado.status}</p>
                                                <select
                                                    value={novoStatusSelecionado}
                                                    onChange={(e) => setNovoStatusSelecionado(e.target.value)}
                                                >
                                                    <option value="">Selecione o novo status</option>
                                                    <option value="Concluído">Concluído</option>
                                                    <option value="Em andamento">Em andamento</option>
                                                    <option value="Aberto">Aberto</option>
                                                    <option value="Pendente">Pendente</option>
                                                </select>
                                                <button className="alterarStatus-btn" onClick={() => alterarStatus(resultado.id)}>Alterar Status</button>
                                            </li>
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum resultado encontrado para o nome inserido.</p>
                            )}
                        </div>
                    )}
                </body>
            </div>
        </div>
    );
}

export default ConsultarMetricas;
