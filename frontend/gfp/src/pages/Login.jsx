import { useState } from "react";
import { enderecoServidor } from "../utils";
import { useNavigate } from "react-router-dom";

function Execicio_Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  async function botaoEntrar(e) {
    e.preventDefault();

    try {
      if (email === '' || senha === '') {
        throw new Error('Preencha todos os campos');
      }

      const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setMensagem('Login Bem-sucedido! ✅');
        localStorage.setItem('UsuarioLogado', JSON.stringify(dados));
        navigate("/principal");
      } else {
        setMensagem('Email ou senha incorretos');
        throw new Error('Email ou senha incorretos');
      }

    } catch (error) {
      console.log('Erro ao realizar login:', error);
      alert(error.message);
    }
  }

  function botaoLimpar() {
    setEmail('');
    setSenha('');
    setMensagem('');
  }

  return (
    <div style={estilos.container}>
      <form style={estilos.card}>
        <p style={estilos.title}>Bem-vindo de volta 👋</p>

        <label style={estilos.label}>Email</label>
        <input
          style={estilos.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={estilos.label}>Senha</label>
        <input
          style={estilos.input}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit" onClick={botaoEntrar} style={estilos.button}>Entrar</button>
        <button type="button" onClick={botaoLimpar} style={estilos.button2}>Limpar</button>

        <p style={estilos.mensagem}>{mensagem}</p>
      </form>
    </div>
  );
}

const estilos = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#4b0082',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#4b0082',
      marginBottom: '10px'
    },
    label: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '4px'
    },
    input: {
      padding: '14px',
      borderRadius: '14px',
      border: '1px solid #ccc',
      fontSize: '16px',
      outline: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    },
    button: {
      backgroundColor: '#4b0082',
      color: '#fff',
      padding: '14px',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px'
    },
    button2: {
      backgroundColor: '#888',
      color: '#fff',
      padding: '14px',
      border: 'none',
      borderRadius: '14px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    mensagem: {
      marginTop: '10px',
      textAlign: 'center',
      color: '#4b0082',
      fontWeight: 'bold'
    }
  };

export default Execicio_Login;