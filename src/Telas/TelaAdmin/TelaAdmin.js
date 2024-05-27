import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';
import './TelaAdmin.css'; 
import Header from '../../Header/Header.js';
import Chart from 'chart.js/auto';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const TelaAdmin = () => {
    const [dadosConsulta, setDadosConsulta] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [mostrarGraficoAtividades, setMostrarGraficoAtividades] = useState(false);
    const [mostrarGraficoUsuariosAtivos, setMostrarGraficoUsuariosAtivos] = useState(false); 
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('');
    const [analistas, setAnalistas] = useState([]);
    const [gestoresData, setGestoresData] = useState({});
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null); // Novo estado para atividade selecionada

    const consultarDados = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'atividades'));
            const dados = [];
            querySnapshot.forEach((doc) => {
                dados.push({ id: doc.id, ...doc.data() });
            });
            setDadosConsulta(dados);
            setMostrarResultados(true); 
        } catch (error) {
            console.error("Erro ao consultar os dados: ", error);
        }
    };

    const buscarAnalistas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'analistas'));
            const analistasData = [];
            querySnapshot.forEach((doc) => {
                const dadosAnalista = doc.data();
                analistasData.push({ id: doc.id, nomeCompleto: dadosAnalista.nomeCompleto, gestor: dadosAnalista.gestor });
            });
            setAnalistas(analistasData);
        } catch (error) {
            console.error("Erro ao buscar os analistas: ", error);
        }
    };

    const calcularGestores = () => {
        const gestores = {};
        analistas.forEach(analista => {
            if (analista.gestor) {
                gestores[analista.gestor] = (gestores[analista.gestor] || 0) + 1;
            }
        });
        setGestoresData(gestores);
    };

    const buscarAtividades = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'atividades'));
            const atividadesData = [];
            querySnapshot.forEach((doc) => {
                atividadesData.push({ id: doc.id, motivo: doc.data().motivo }); // Apenas o campo motivo
            });
            setAtividades(atividadesData);
        } catch (error) {
            console.error("Erro ao buscar as atividades: ", error);
        }
    };

    const formatarData = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const buscarAtividadeCompleta = async (atividadeId) => {
        try {
            const docRef = doc(db, 'atividades', atividadeId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const atividadeCompleta = {
                    id: docSnap.id,
                    motivo: data.motivo,
                    dataTermino: formatarData(data.dataTermino),
                    nomeAnalista: data.nomeAnalista,
                    status: data.status,
                    descricao: data.descricao
                };
                setAtividadeSelecionada(atividadeCompleta);
            } else {
                console.error("Documento não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar a atividade completa: ", error);
        }
    };

    useEffect(() => {
        consultarDados();
    }, []);

    useEffect(() => {
        let instanciaDoGraficoAtividades = null;

        if (mostrarGraficoAtividades && dadosConsulta.length > 0) { 
            const analistasData = {};
            dadosConsulta.forEach((item) => {
                const nomeAnalista = item.nomeAnalista;
                analistasData[nomeAnalista] = (analistasData[nomeAnalista] || 0) + 1;
            });

            const ctx = document.getElementById('chart-atividades');
            if (ctx) {
                if (instanciaDoGraficoAtividades) {
                    instanciaDoGraficoAtividades.destroy();
                }
                instanciaDoGraficoAtividades = new Chart(ctx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: Object.keys(analistasData),
                        datasets: [{
                            label: 'Atividades por Analista',
                            data: Object.values(analistasData),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#fff'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#fff'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#fff'
                                }
                            }
                        }
                    }
                });
            }
        }
    }, [mostrarGraficoAtividades, dadosConsulta]);

    useEffect(() => {
        let instanciaDoGraficoUsuariosAtivos = null;

        if (mostrarGraficoUsuariosAtivos && Object.keys(gestoresData).length > 0) {
            const ctx = document.getElementById('chart-gestores');
            if (ctx) {
                instanciaDoGraficoUsuariosAtivos = new Chart(ctx.getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: Object.keys(gestoresData),
                        datasets: [{
                            label: 'Gestores',
                            data: Object.values(gestoresData),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(54, 162, 235, 0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#fff'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#fff'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#fff'
                                }
                            }
                        }
                    }
                });
            }
        }
    }, [mostrarGraficoUsuariosAtivos, gestoresData]);

    const handleOpcaoClick = (opcao) => {
        setOpcaoSelecionada(opcao); 
        if (opcao === 'Atividades') {
            setMostrarGraficoAtividades(true); 
            setMostrarGraficoUsuariosAtivos(false);
        } else if (opcao === 'Gestores') {
            setMostrarGraficoAtividades(false);
            setMostrarGraficoUsuariosAtivos(true);
        } else {
            setMostrarGraficoAtividades(false);
            setMostrarGraficoUsuariosAtivos(false); 
        }
        if (opcao === 'Chamados') {
            buscarAtividades();
            setAtividadeSelecionada(null); // Resetar a atividade selecionada ao mudar para 'Chamados'
        }
    };

    useEffect(() => {
        buscarAnalistas();
    }, []);

    useEffect(() => {
        if (analistas.length > 0) {
            calcularGestores();
        }
    }, [analistas]);

    return (
        <div>
            <Header />
            <div className="tela-Admin">
                <div className="menu-lateral">
                    <ul>
                        <li onClick={() => handleOpcaoClick('Chamados')}>Chamados</li>
                        <li onClick={() => handleOpcaoClick('Atualizações')}>Atualizações</li>
                        <li onClick={() => handleOpcaoClick('Atividades')}>Atividades</li>
                        <li onClick={() => handleOpcaoClick('Gestores')}>Gestores</li>
                    </ul>
                </div>
                <div className="conteudo-principal">
                    {opcaoSelecionada === 'Atividades' && (
                        <div>
                            <h1>Atividades dos Analistas</h1>
                            {mostrarResultados && mostrarGraficoAtividades && (
                                <div>
                                    <div className="resultado-consulta">
                                        <h3>Resultados:</h3>
                                        <canvas id="chart-atividades" width="300" height="300"></canvas>
                                    </div>
                                    <div className="lista-analistas">
                                        <h2>Lista de Analistas:</h2>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nome Completo do Analista</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analistas.map((analista, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{analista.nomeCompleto}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {opcaoSelecionada === 'Gestores' && (
                        <div>
                            <h1>Gestores</h1>
                            {mostrarGraficoUsuariosAtivos && (
                                <div>
                                    <div className="resultado-consulta">
                                        <h3>Distribuição de Gestores:</h3>
                                        <canvas id="chart-gestores" width="300" height="300"></canvas>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {opcaoSelecionada === 'Chamados' && (
                        <div>
                            <h2>Chamados</h2>
                            {!atividadeSelecionada ? (
                                <div className="lista-atividades">
                                    {atividades.map((atividade, index) => (
                                        <div 
                                            key={index} 
                                            className="atividade"
                                            onClick={() => buscarAtividadeCompleta(atividade.id)}
                                        >
                                            <p><strong>Motivo:</strong> {atividade.motivo}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="atividade-completa">
                                    <h2>Detalhes da Atividade</h2>
                                    <p><strong>ID:</strong> {atividadeSelecionada.id}</p>
                                    <p><strong>Motivo:</strong> {atividadeSelecionada.motivo}</p>
                                    <p><strong>Data Término:</strong> {atividadeSelecionada.dataTermino}</p>
                                    <p><strong>Nome do Analista:</strong> {atividadeSelecionada.nomeAnalista}</p>
                                    <p><strong>Status:</strong> {atividadeSelecionada.status}</p>
                                    <p><strong>Descrição:</strong> {atividadeSelecionada.descricao}</p>
                                    <button onClick={() => setAtividadeSelecionada(null)}>Voltar</button>
                                </div>
                            )}
                        </div>
                    )}
                    {opcaoSelecionada === 'Atualizações' && (
                        <div>
                            <h2>Conteúdo da Opção 2</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TelaAdmin;
