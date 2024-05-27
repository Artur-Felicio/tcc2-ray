import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase';
import './GerenciarAnalista.css'; 
import Header from '../../Header/Header.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GerenciarAnalista = () => {
    const [matricula, setMatricula] = useState('');
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [gestor, setGestor] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [documentoId, setDocumentoId] = useState(null); // Estado para armazenar o ID do documento

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    const salvarDadosNoFirestore = async () => {
        try {
            const docRef = await addDoc(collection(db, 'analistas'), {
                matricula: matricula,
                nomeCompleto: nomeCompleto,
                email: email,
                departamento: departamento,
                gestor: gestor
            });
            console.log("Document written with ID: ", docRef.id);
            setMatricula('');
            setNomeCompleto('');
            setEmail('');
            setDepartamento('');
            setGestor('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const pesquisar = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, 'analistas'), where("matricula", "==", matricula)));
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setNomeCompleto(data.nomeCompleto);
                    setEmail(data.email);
                    setDepartamento(data.departamento);
                    setGestor(data.gestor);
                    setErrorMessage('');
                    setDocumentoId(doc.id); // Define o ID do documento encontrado
                });
            } else {
                setNomeCompleto('');
                setEmail('');
                setDepartamento('');
                setGestor('');
                setErrorMessage('Nenhum registro encontrado.');
                setDocumentoId(null); // Reseta o ID do documento
            }
        } catch (error) {
            console.error("Error searching document: ", error);
        }
    };

    const excluirDadosDoFirestore = async () => {
        if (documentoId) {
            try {
                console.log("Tentando excluir documento com ID: ", documentoId);
                await deleteDoc(doc(db, 'analistas', documentoId));
                console.log("Document successfully deleted!");
                setMatricula('');
                setNomeCompleto('');
                setEmail('');
                setDepartamento('');
                setGestor('');
                setErrorMessage('Dados excluídos com sucesso.');
                setDocumentoId(null); // Resetar o ID do documento
            } catch (e) {
                console.error("Error deleting document: ", e);
                setErrorMessage('Erro ao excluir os dados. Por favor, tente novamente.');
            }
        } else {
            setErrorMessage('Nenhum documento encontrado para exclusão.');
        }
    };

    const confirmExclusao = () => {
        const confirmacao = window.confirm("Tem certeza disto?");
        if (confirmacao) {
            excluirDadosDoFirestore();
        }
    };
    
    return (
        <div>
        <Header />
        <div className="gerenciaranalista">
            
            <body className='bodyy'>
                <h2>Dados do Analista</h2>
                <div className='matricula'>
                    <label>Matricula:</label>
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                    <button onClick={pesquisar}>PESQUISAR</button>
                </div>
                <div>
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Departamento:</label>
                    <input
                        type="text"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                    />
                </div>
                <div>
                    <label>Gestor:</label>
                    <input
                        type="text"
                        value={gestor}
                        onChange={(e) => setGestor(e.target.value)}
                    />
                </div>
                <div className='buttons'>
                    <button onClick={salvarDadosNoFirestore}>Salvar</button>
                    <button onClick={confirmExclusao}>Excluir</button>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </body>
        </div>
        </div>
    );
}

export default GerenciarAnalista;
