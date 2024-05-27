import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import Logo from '../imgs/Logo.png';
import Vector from '../imgs/Vector.png';
import menu from '../imgs/menu.png';
import solar from '../imgs/solar.png';
import fechar from '../imgs/fechar.png';
import casa from '../imgs/casa.png';
import grafico from '../imgs/grafico.png';
import arquivo from '../imgs/arquivo.png';

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      <header className="header">
        <img src={menu} alt="menu" className="menu" onClick={toggleSidebar} />
        <img src={Logo} alt="Logo" className="Logo" />
        <div className="spacer"></div>
        <div className="vector-container">
          <img src={Vector} alt="Vector" className="Vector" />
          <h1>Usuario</h1>
        </div>
      </header>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo at the top of the sidebar */}
        <img src={Logo} alt="Logo" className="logo-sidebar" />
        {/* Image for closing the sidebar */}
        <img src={fechar} alt="Fechar" className="fechar-btn" onClick={closeSidebar} />
        {/* Lista de links */}
        <div className='topicos'>
        <ul>
        <li><Link to="/telainicial" onClick={closeSidebar}> <img src={casa} alt="casa" />
          <p>Home</p></Link></li>
          <li><Link to="/telaadmin" onClick={closeSidebar}> <img src={grafico} alt="grafico" />
          <p>Grafico</p></Link></li>
          <li><Link to="/telaatividade" onClick={closeSidebar}> <img src={arquivo} alt="arquivo" />
          <p>Atividade</p></Link></li>
          <li><Link to="/telagit" onClick={closeSidebar}> <img src={solar} alt="solar" />
          <p>Upload GitHub</p></Link></li>
          <li><Link to="/" onClick={closeSidebar}>Usuario</Link></li>
          {/* Adicione outros links conforme necessário */}
        </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
