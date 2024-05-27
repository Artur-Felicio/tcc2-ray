import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../../src/firebase.js';
import './TelaAdmin.css'; 
import Header from '../../src/Header/Header.js';
import Chart from 'chart.js/auto';

const db = getFirestore();

const TelaAdmin = () => {
    const [dadosConsulta, setDadosConsulta] = useState([]);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    const [mostrarGrafico, setMostrarGrafico] = useState(false); // Estado para controlar a visibilidade do gráfico
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

    const consultarDados = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'atividades'));
            const dados = [];
            querySnapshot.forEach((doc) => {
                dados.push({ id: doc.id, ...doc.data() });
            });
            setDadosConsulta(dados);
            setMostrarResultados(true); // Mostrar resultados quando a consulta for realizada com sucesso
        } catch (error) {
            console.error("Erro ao consultar os dados: ", error);
        }
    };

    useEffect(() => {
        consultarDados();
    }, []);

    useEffect(() => {
        if (mostrarGrafico) { // Verificar se o estado mostrarGrafico é verdadeiro antes de renderizar o gráfico
            // Preparar dados para o gráfico de barras
            const analistas = {};
            dadosConsulta.forEach((item) => {
                const nomeAnalista = item.nomeAnalista;
                analistas[nomeAnalista] = (analistas[nomeAnalista] || 0) + 1;
            });

            // Criar gráfico de barras
            const ctx = document.getElementById('chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(analistas),
                    datasets: [{
                        label: 'Atividades por Analista',
                        data: Object.values(analistas),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de preenchimento das barras
                        borderColor: 'rgba(75, 192, 192, 1)', // Cor da borda das barras
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#fff' // Cor dos números no eixo Y
                            }
                        },
                        x: {
                            ticks: {
                                color: '#fff' // Cor dos números no eixo X
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff' // Cor dos rótulos (legendas)
                            }
                        }
                    }
                }
            });
            
        }
    }, [mostrarGrafico, dadosConsulta]);

    // Função para lidar com o clique em cada opção do menu lateral
    const handleOpcaoClick = (opcao) => {
        setOpcaoSelecionada(opcao); // Atualizar a opção selecionada
        if (opcao === 'Atividades') {
            setMostrarGrafico(true); // Ativar a exibição do gráfico se a opção for 'Atividades'
        } else {
            setMostrarGrafico(false); // Desativar a exibição do gráfico para outras opções
        }
    };

    return (
        <div>
            <Header />
            <div className="tela-Admin">
                <div className="menu-lateral">
                    {/* Conteúdo do menu lateral */}
                    <ul>
                        <li onClick={() => handleOpcaoClick('Chamados')}>Teste 1</li>
                        <li onClick={() => handleOpcaoClick('Opção 2')}>Opção 2</li>
                        <li onClick={() => handleOpcaoClick('Atividades')}>Atividades</li>
                    </ul>
                </div>
                <div className="conteudo-principal">
                    {/* Conteúdo principal da página */}
                    {opcaoSelecionada === 'Atividades' && (
                        <div>
                            <h1>Atividades dos Analistas</h1>
                            {mostrarResultados && mostrarGrafico && ( // Renderizar somente se mostrarResultados e mostrarGrafico forem verdadeiros
                                <div className="resultado-consulta">
                                    <h3>Resultados:</h3>
                                    <canvas id="chart" width="400" height="400"></canvas>
                                </div>
                            )}
                        </div>
                    )}
                    {opcaoSelecionada === 'Chamados' && (
                        <div>
                            <h2>Conteúdo da Opção 1</h2>
                        </div>
                    )}
                    {opcaoSelecionada === 'Opção 2' && (
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
