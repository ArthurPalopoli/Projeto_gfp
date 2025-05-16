import React, { useState,  useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Principal() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate()
  useEffect(() => {
    const buscarUsuario = async () => {
        const usuarioLogado = await localStorage.getItem("UsuarioLogado");
        if (usuarioLogado) {        
            setUsuario(JSON.parse(usuarioLogado));
        } else {
            navigate('/');
        }
    };
    buscarUsuario();
  }, []);
  const botaoLogout = () => {
    try{
        localStorage.removeItem('UsuarioLogado')
        navigate('/')
    }catch(error) {
        console.error('Erro ao desligar', error)
    }
    
  }

    return (
        <div>
            <h1>Bem vindo</h1>
        </div>
    );
}