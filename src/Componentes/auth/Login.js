import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './styles.css';
import Logo from '../../imgs/Logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            window.location.href = '/TelaInicial';
        } catch (error) {
            console.log(error);
            setError('Credenciais inválidas. Por favor, tente novamente.');
        }
    };

    return (
        <div className="sign-in-container">
            <form onSubmit={handleLogin}>
                <img src={Logo} alt="Logo" className="logo-img" />
                <div className="input-field">
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-field">
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Entrar</button>
            </form>
            <p>Não possui uma conta? <Link to="/teste">Crie uma conta</Link>.</p>
        </div>
    );
};

export default Login;
