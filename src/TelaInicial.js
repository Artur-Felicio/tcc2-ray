import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TelaInicial.css';
// import logo from './Componentes/auth/logo.jpeg';
// import Vector from './imgs/Vector.png';
import admin from './imgs/admin.png';
import solar from './imgs/solar.png';
import arquivo from './imgs/arquivo.png';
import pesquisar from './imgs/pesquisar.png';
// import menu from './imgs/menu.png';
import Header from './Header/Header.js';

function TelaInicial() {
  
  return (
    <div>
      <Header />
      <body className= 'bodyy'>
        <h2 className='BemVindo'>Seja Bem Vindo!</h2>
        <div className='campos'>
            <Link to="/gerenciaranalista" className='div1'>
                      <img src={admin} alt="admin" />
                      <p>Gerenciar Analista</p>
            </Link>
            <Link to="/telaatividade" className='div1'>
                      <img src={arquivo} alt="arquivo" />
                      <p>Gerenciar Atividade</p>
            </Link>
            <Link to="/consultarmetricas" className='div1'>
                      <img src={pesquisar} alt="pesquisar" />
                      <p>Consultar Métricas</p>
            </Link>
            <Link to="/telagit" className='div1'>
                      <img src={solar} alt="solar" />
                      <p>Upload GitHub</p>
            </Link>
        </div>
      </body>
    </div>
  );
}

export default TelaInicial;
